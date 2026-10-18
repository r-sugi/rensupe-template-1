# CLAUDE.md

レンタルスペース向け1ページLPのテンプレート。Cloudflare Workers（SSR）＋ D1 ＋ R2 で配信し、主な利用者は「Deploy to Cloudflare」ボタンで自分のアカウントに公開する非エンジニア。README.md はその利用者向けの画面操作マニュアルなので、技術的な説明はこのファイルに書く。利用者は無料の Antigravity（Google）か Claude Code で作業を頼む想定で、Antigravity 向けの手順は `.agents/skills/update-site-content/SKILL.md` にある。内容変更の手順を変えたら、このファイルとあわせて更新する。

## 利用者（非エンジニア）から内容の変更を頼まれたとき

利用者は「店名を〇〇にして公開して」「料金を1,000円にして」「この写真をトップにして」のように日本語で頼んでくる。SQL やコマンドは見せずに、次の手順で最後（公開）まで進める。

1. 内容の正本は `content/site.yaml`（文章・料金・FAQ など）と `content/photos/`（写真）。**D1 を直接書き換えない**（デプロイのたびに site.yaml の内容で上書きされる）。
2. `content/site.yaml` を編集する。項目名は `src/content.ts` の `SETTING_KEYS` と一致させ、既存のコメントと構造は保つ。料金 `amount` は整数。地図の URL は `address` から自動生成されるので、住所の変更だけでよい。
3. 写真は `content/photos/` にコピーし、ファイル名は半角小文字にする（トップ `hero.jpg`、設備 `facility-01.jpg`〜）。枚数やファイル名を変えたら `site.yaml` の `photos` / `hero_image_key` も合わせる。目安として長辺 2000px・5MB 以下に縮小する。
4. `npm run content:sync:local` で記入ミスがないか確かめる（`✖` で始まる日本語エラーが出たら直す）。見た目の確認が必要なら `npm run dev`。
5. 変更内容を利用者に日本語で短く説明し、了承を得てから `main` にコミットして push する。push すると Workers Builds が自動でデプロイし、2〜3分で反映される。
6. 利用者が Cloudflare のデプロイ記録のエラーを貼ってきたら、`✖` のメッセージに従って `site.yaml` を直して再度 push する。

初回は、利用者の GitHub にあるこのリポジトリのコピーを clone するところから始まる（`git clone https://github.com/<ユーザー名>/<リポジトリ名>`）。GitHub の認証でブラウザが開いたら、利用者に「許可」を押してもらう。

## 技術構成

| 役割 | 使うもの |
| --- | --- |
| SSR | Cloudflare Workers + Hono 4.13.13（`hono/jsx`） |
| CSS | Tailwind CSS 4.3.3（`@tailwindcss/cli` で `public/assets/styles.css` にビルドし、静的アセットとして配信） |
| 内容 | D1（バインディング `DB`、DB名の初期値 `rensupe-lp`） |
| 写真 | R2（バインディング `IMAGES`、バケット名の初期値 `rensupe-lp-images`、`/images/<key>` で配信） |
| ツール | Wrangler 4.151.1 / TypeScript 7.0.2（すべて devDependencies に固定。グローバルの wrangler に依存しない） |

依存は最新の安定版に揃えている。上げるときは `npm view <pkg> dist-tags` で `latest` を確認する。

## ディレクトリ

```
src/
  index.tsx             ルーティング（GET / と GET /images/*）
  content.ts            D1読み込み（7クエリを1回の batch で取得）。SETTING_KEYS が site_settings のキー一覧
  images.ts             R2配信（ETag/304）。R2に無いキーは image_sources の取得元から fetch して R2 に保存。どちらにも無ければグレーのSVG（404）
  styles.css            Tailwind v4 の @theme（デザイントークン）と @utility
  components/
    layout.tsx          <head>、ヘッダー、フッター、スマホ固定CTA
    sections.tsx        ヒーロー〜アクセスの各セクション
    ui.tsx              Brand / Button / SectionName / Lead / Section
content/
  site.yaml             ホームページの内容の正本（[ ] がプレースホルダー）
  photos/               写真の正本（ファイル名 = R2 のキー）
migrations/
  0001_init.sql         スキーマ
  0002_seed.sql         何もしない（内容は content/site.yaml から同期）
  0003_image_sources.sql 写真の取得元テーブル（任意・初期データなし）
  0004_content_assets.sql 同期済み写真のハッシュ（変わった写真だけ R2 に上げるため）
scripts/
  sync-content.mjs      content/ を D1・R2 に同期（--local / --remote）。記入ミスは日本語エラーで止める
  release.sh            ボタンを使わない初回リリース（D1・R2作成 → database_id 書き込み → npm run deploy）
public/_headers         /assets/* のキャッシュ設定
```

`public/assets/styles.css` と `worker-configuration.d.ts` は生成物で、git 管理しない。

## コマンド

```bash
npm ci
npm run cf-typegen          # worker-configuration.d.ts を生成（wrangler.jsonc を変えたら再実行）
npm run typecheck           # wrangler types + tsc --noEmit

npm run content:sync:local  # content/ をローカルの D1・R2 に同期（記入ミスのチェックも兼ねる）
npm run dev                 # マイグレーション・同期のあと http://localhost:8787 で起動（Tailwind の watch 付き）

npx wrangler login
npm run release             # 初回：D1・R2を作成し、database_id を書き込んでデプロイ
npm run deploy              # 2回目以降：CSSビルド → マイグレーション → content 同期（--remote）→ wrangler deploy
```

`node_modules` には OS ごとのネイティブバイナリ（workerd、Tailwind の oxide）が入る。別 OS で入れたものを持ち込むと `You installed workerd on another platform` で落ちるので、実行するマシンで `npm ci` し直す。

## Deploy to Cloudflare ボタンの前提（壊さないこと）

- Cloudflare は `wrangler.jsonc` を読んで D1・R2 を作成し、新しい ID で利用者側リポジトリの設定を書き換える。そのため `database_id` はダミー値（`00000000-0000-0000-0000-000000000000`）のままにする。実在の ID・`account_id`・`routes` はコミットしない。
- Workers Builds は `package.json` の `build` と `deploy` を実行する。`deploy` でマイグレーションと content 同期を流しており、対象は DB 名ではなくバインディング名 `DB` を指定している（利用者が DB 名を変えても動くように）。main への push のたびに同じ流れで再デプロイされる。
- content 同期で検証エラーになるとデプロイ全体が止まり、公開中のページは前のまま残る（README でもそう案内している）。
- `package.json` の `cloudflare.bindings` の説明文がボタンの設定画面に表示される。
- `workers_dev: true` で公開し、独自ドメインは利用者がダッシュボードで追加する（README の手順 A〜C）。
- ボタンはリポジトリが public でないと使えない。
- 店舗固有の値（店名・住所・URL・カレンダーID・写真の取得元など）はリポジトリに入れない。必要な値はすべて `0002_seed.sql` のプレースホルダーにする。

## 仕組みと変更時の注意

- 内容の流れ：`content/site.yaml` / `content/photos/` → `scripts/sync-content.mjs`（デプロイ時）→ D1 の各テーブル・R2 → Worker が SSR。site.yaml の一覧は順番がそのまま `sort` になる。
- 同期は内容テーブルを毎回 DELETE → INSERT で入れ替える。写真は `content_assets` のハッシュと比べて変わったものだけ R2 に put する（R2 から古い写真は消さない）。
- `site_settings` にキーを足すときは、`src/content.ts` の `SETTING_KEYS` に追加し、`content/site.yaml` にも項目を足す（同期スクリプトは SETTING_KEYS に無いキーをエラーにする）。
- スキーマ変更は `migrations/0005_xxx.sql` のように新しいファイルを追加し、同期スクリプトの SQL 生成も合わせる。既存のマイグレーションは書き換えない。
- README の利用者向け手順と食い違う変更をしたら、README も合わせて直す。README に SQL やコマンドは書かない（利用者は読まない・実行しない）。

## デザイン

元になった LP の見た目を再現している。変えるときは `src/styles.css` の `@theme` から。

- 色：`ink #4a4a4a` / `paper #fff` / `soft #fafafa` / `accent #ffd447` / `line #e5e5e5` / `muted #727272`（ほかに `lead` `sub` `faint` `caption` `tag` `rule` `calendar`）
- フォント：本文 `Noto Sans JP`、数字・ロゴ `DM Sans`（Google Fonts）
- 幅：`--container-site: 1180px`、`wrap` ユーティリティで左右余白 SP 14px / それ以上 20px
- ブレークポイント：既定値を消し、`md` = 621px〜、`lg` = 901px〜（元 CSS の `max-width: 620px / 900px` に対応したモバイルファースト）
- `html` の `scroll-padding-top` はヘッダーの実高さに合わせて SP 96px / タブレット 126px / PC 92px

レイアウト：
- PC（901px〜）：ヘッダー1行（リンクにホバーで黄色の下線）、写真3列、料金3列、ステップ4列（間に →）
- タブレット（621〜900px）：ヘッダー2段（ロゴ／横スクロールのリンク）高さ112px、写真2列、料金1列、ステップ2列
- スマホ（〜620px）：すべて1列（ステップの間に ↓）、画面下に固定の予約ボタン。ヘッダーの「予約する」は固定ボタンと重なるので非表示
- ヒーローの H1 は `hero_title_a` と `hero_title_b` を `inline-block` で並べ、その境目で折り返す
