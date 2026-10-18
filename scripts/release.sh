#!/usr/bin/env bash
# （開発者向け）ボタンを使わずに、手元の wrangler で D1・R2 を用意してデプロイする
# 何度実行しても安全
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;33m▶ %s\033[0m\n' "$1"; }
fail() { printf '\033[1;31m✖ %s\033[0m\n' "$1" >&2; exit 1; }

# wrangler.jsonc から D1・R2 の名前を読む（行頭の // コメントを除いて JSON として解析）
eval "$(node -e '
  const fs = require("fs");
  const src = fs.readFileSync("wrangler.jsonc", "utf8").split("\n").filter(l => !l.trim().startsWith("//")).join("\n");
  const c = JSON.parse(src);
  console.log(`DB_NAME=${JSON.stringify(c.d1_databases?.[0]?.database_name ?? "")}`);
  console.log(`BUCKET=${JSON.stringify(c.r2_buckets?.[0]?.bucket_name ?? "")}`);
')"
[ -n "$DB_NAME" ] && [ -n "$BUCKET" ] || fail "wrangler.jsonc に d1_databases / r2_buckets がありません"

step "1/4 Cloudflare認証"
if ! npx wrangler whoami 2>/dev/null | grep -q "You are logged in"; then
  npx wrangler login
fi

db_id() {
  npx wrangler d1 list --json 2>/dev/null | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const l=JSON.parse(s);const d=l.find(x=>x.name===process.argv[1]);
      process.stdout.write(d?d.uuid:"");})' "$DB_NAME"
}

step "2/4 D1データベース（$DB_NAME）"
ID="$(db_id)"
if [ -z "$ID" ]; then
  npx wrangler d1 create "$DB_NAME" --update-config=false >/dev/null
  ID="$(db_id)"
fi
[ -n "$ID" ] || fail "D1のIDを取得できませんでした"
node -e '
  const fs=require("fs");const f="wrangler.jsonc";
  fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace(/("database_id":\s*")[^"]*(")/,`$1${process.argv[1]}$2`));' "$ID"
echo "database_id = $ID"

step "3/4 R2バケット（$BUCKET）"
if npx wrangler r2 bucket list 2>/dev/null | grep -qw "$BUCKET"; then
  echo "$BUCKET は作成済み"
else
  npx wrangler r2 bucket create "$BUCKET" --update-config=false
fi

step "4/4 マイグレーションとデプロイ"
CI=1 npm run deploy

echo
echo "完了：上に表示された https://〜.workers.dev を開いてください"
