#!/usr/bin/env node
/**
 * content/site.yaml と content/photos を D1・R2 に同期する。
 *   node scripts/sync-content.mjs --local   … wrangler dev 用のローカル D1/R2
 *   node scripts/sync-content.mjs --remote  … 本番（デプロイ時に自動で実行される）
 *
 * - 内容のテーブルは毎回まるごと入れ替える（site.yaml が正本）
 * - 写真は前回からハッシュが変わったものだけ R2 にアップロードする
 * - 記入ミスがあれば日本語のエラーで止まる（デプロイも止まり、公開中のページはそのまま）
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { parse } from "yaml";

const target = process.argv[2];
if (target !== "--local" && target !== "--remote") {
  console.error("使い方: node scripts/sync-content.mjs --local | --remote");
  process.exit(1);
}

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT = join(ROOT, "content/site.yaml");
const PHOTOS = join(ROOT, "content/photos");
const PHOTO_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const errors = [];
const fail = (msg) => errors.push(msg);

// ── 読み込み ────────────────────────────────────────────────
let data;
try {
  data = parse(readFileSync(CONTENT, "utf8"));
} catch (e) {
  console.error(`✖ content/site.yaml の書き方に誤りがあります（${e.linePos?.[0]?.line ?? "?"}行目付近）`);
  console.error(`  ${e.message.split("\n")[0]}`);
  console.error("  字下げ（先頭のスペース）や、: を含む文章を ' ' で囲んでいるかを確認してください。");
  process.exit(1);
}

// site_settings に使えるキーは src/content.ts の SETTING_KEYS と同じ
const keysSrc = readFileSync(join(ROOT, "src/content.ts"), "utf8").match(/SETTING_KEYS = \[([\s\S]*?)\]/);
const SETTING_KEYS = [...(keysSrc?.[1] ?? "").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);

const str = (v) => (v === null || v === undefined ? "" : String(v)).replace(/\n+$/, "");
const list = (name) => {
  const v = data?.[name];
  if (!Array.isArray(v)) {
    fail(`「${name}」が見つからないか、一覧の形（- で始まる行）になっていません`);
    return [];
  }
  return v;
};
const need = (obj, keys, where) => {
  for (const k of keys) if (obj?.[k] === undefined || obj?.[k] === null || obj?.[k] === "") fail(`${where} の「${k}」が空です`);
};

// ── site（site_settings） ─────────────────────────────────────
const site = data?.site ?? {};
if (typeof site !== "object") fail("「site」の形が正しくありません");
for (const k of Object.keys(site)) {
  if (!SETTING_KEYS.includes(k)) fail(`site の「${k}」は使えない項目名です（綴りを確認してください）`);
}
// 地図は住所から作る（明示されていればそれを使う）
const addressOneLine = str(site.address).split("\n").map((s) => s.trim()).filter(Boolean).join(" ");
const settings = { ...site };
if (!settings.map_url && addressOneLine)
  settings.map_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOneLine)}`;
if (!settings.map_embed_url && addressOneLine)
  settings.map_embed_url = `https://www.google.com/maps?q=${encodeURIComponent(addressOneLine)}&output=embed`;

// ── 一覧 ──────────────────────────────────────────────────
const features = list("features");
features.forEach((f, i) => need(f, ["title", "body"], `features の${i + 1}番目`));

const specs = list("specs").map(str);

const photos = list("photos");
photos.forEach((p, i) => need(p, ["file", "alt", "caption"], `photos の${i + 1}番目`));

const prices = list("prices");
prices.forEach((p, i) => {
  need(p, ["tag", "title", "amount", "note"], `prices の${i + 1}番目`);
  const n = Number(String(p?.amount ?? "").replace(/[,，円¥\s]/g, ""));
  if (!Number.isInteger(n) || n < 0) fail(`prices の${i + 1}番目の「amount」は数字だけで書いてください（例: 900）`);
  else p.amount = n;
});

const steps = list("steps");
steps.forEach((s, i) => need(s, ["title", "body"], `steps の${i + 1}番目`));

const faqs = list("faqs");
faqs.forEach((f, i) => need(f, ["question", "answer"], `faqs の${i + 1}番目`));

// 写真ファイル（半角小文字のファイル名だけを対象にする）
const photoFiles = existsSync(PHOTOS)
  ? readdirSync(PHOTOS).filter((f) => PHOTO_TYPES[extname(f).toLowerCase()])
  : [];
for (const f of photoFiles) {
  if (f !== f.toLowerCase() || /\s/.test(f)) fail(`写真「${f}」のファイル名は、半角小文字でスペースなしにしてください`);
}
const referenced = [settings.hero_image_key, ...photos.map((p) => p?.file)].filter(Boolean).map(str);
const missing = referenced.filter((f) => !photoFiles.includes(f));

if (errors.length) {
  console.error("✖ content/site.yaml を確認してください：");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// ── wrangler 呼び出し ──────────────────────────────────────
const wrangler = (args, opts = {}) =>
  execFileSync("npx", ["wrangler", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: opts.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, CI: "1" },
  });

const config = JSON.parse(
  readFileSync(join(ROOT, "wrangler.jsonc"), "utf8")
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"))
    .join("\n"),
);
const bucket = config.r2_buckets?.[0]?.bucket_name;

// ── 写真のアップロード（変わったものだけ） ───────────────────────
let uploaded = [];
if (photoFiles.length) {
  let known = new Map();
  try {
    const out = wrangler(["d1", "execute", "DB", target, "--json", "--command", "SELECT r2_key, sha256 FROM content_assets"], {
      capture: true,
    });
    const rows = JSON.parse(out).flatMap((r) => r.results ?? []);
    known = new Map(rows.map((r) => [r.r2_key, r.sha256]));
  } catch {
    // 初回などでテーブルが読めなければ全件アップロード
  }
  for (const f of photoFiles) {
    const path = join(PHOTOS, f);
    const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
    if (known.get(f) === hash) continue;
    console.log(`↑ 写真をアップロード: ${f}`);
    wrangler(["r2", "object", "put", `${bucket}/${f}`, "--file", path, "--content-type", PHOTO_TYPES[extname(f).toLowerCase()], target]);
    uploaded.push([f, hash]);
  }
}

// ── 内容の SQL を作って D1 に流す ──────────────────────────────
const q = (v) => `'${str(v).replace(/'/g, "''")}'`;
const sql = [];
sql.push("DELETE FROM site_settings;");
for (const [k, v] of Object.entries(settings)) sql.push(`INSERT INTO site_settings (key, value) VALUES (${q(k)}, ${q(v)});`);
sql.push("DELETE FROM features;");
features.forEach((f, i) => sql.push(`INSERT INTO features (sort, title, body) VALUES (${i + 1}, ${q(f.title)}, ${q(f.body)});`));
sql.push("DELETE FROM facility_specs;");
specs.forEach((s, i) => sql.push(`INSERT INTO facility_specs (sort, label) VALUES (${i + 1}, ${q(s)});`));
sql.push("DELETE FROM facility_photos;");
photos.forEach((p, i) =>
  sql.push(`INSERT INTO facility_photos (sort, r2_key, alt, caption) VALUES (${i + 1}, ${q(p.file)}, ${q(p.alt)}, ${q(p.caption)});`),
);
sql.push("DELETE FROM prices;");
prices.forEach((p, i) =>
  sql.push(`INSERT INTO prices (sort, tag, title, amount, note) VALUES (${i + 1}, ${q(p.tag)}, ${q(p.title)}, ${p.amount}, ${q(p.note)});`),
);
sql.push("DELETE FROM steps;");
steps.forEach((s, i) => sql.push(`INSERT INTO steps (sort, title, body) VALUES (${i + 1}, ${q(s.title)}, ${q(s.body)});`));
sql.push("DELETE FROM faqs;");
faqs.forEach((f, i) => sql.push(`INSERT INTO faqs (sort, question, answer) VALUES (${i + 1}, ${q(f.question)}, ${q(f.answer)});`));
for (const [k, h] of uploaded)
  sql.push(`INSERT INTO content_assets (r2_key, sha256) VALUES (${q(k)}, ${q(h)}) ON CONFLICT(r2_key) DO UPDATE SET sha256 = excluded.sha256;`);

const file = join(mkdtempSync(join(tmpdir(), "rensupe-")), "content.sql");
writeFileSync(file, sql.join("\n") + "\n");
console.log(`↻ 内容を同期: ${target === "--remote" ? "本番" : "ローカル"}の D1`);
wrangler(["d1", "execute", "DB", target, "--file", file]);

console.log(`✔ 同期しました（写真のアップロード ${uploaded.length}件）`);
if (missing.length) {
  console.log(`ℹ 次の写真は content/photos にまだ無いため、仮の画像が表示されます: ${missing.join(", ")}`);
}
