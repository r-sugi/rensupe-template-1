# CLAUDE.md

レンタルスペース向け1ページLPのテンプレート。Cloudflare Workers（SSR）＋ D1 ＋ R2 で配信し、主な利用者は「Deploy to Cloudflare」ボタンで自分のアカウントに公開する非エンジニア。README.md はその利用者向けの画面操作マニュアルなので、技術的な説明はこのファイルに書く。

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
migrations/
  0001_init.sql         スキーマ
  0002_seed.sql         初期データ。[ ] で囲んだ値がプレースホルダー
  0003_image_sources.sql 写真の取得元テーブル（初期データなし）
scripts/
  release.sh            ボタンを使わない初回リリース（D1・R2作成 → database_id 書き込み → npm run deploy）
public/_headers         /assets/* のキャッシュ設定
```

`public/assets/styles.css` と `worker-configuration.d.ts` は生成物で、git 管理しない。

## コマンド

```bash
npm ci
npm run cf-typegen          # worker-configuration.d.ts を生成（wrangler.jsonc を変えたら再実行）
npm run typecheck           # wrangler types + tsc --noEmit

npm run db:migrate:local
npm run dev                 # http://localhost:8787（Tailwind の watch と wrangler dev を同時起動）

npx wrangler login
npm run release             # 初回：D1・R2を作成し、database_id を書き込んでデプロイ
npm run deploy              # 2回目以降：CSSビルド → マイグレーション（--remote）→ wrangler deploy
```

`node_modules` には OS ごとのネイティブバイナリ（workerd、Tailwind の oxide）が入る。別 OS で入れたものを持ち込むと `You installed workerd on another platform` で落ちるので、実行するマシンで `npm ci` し直す。

## Deploy to Cloudflare ボタンの前提（壊さないこと）

- Cloudflare は `wrangler.jsonc` を読んで D1・R2 を作成し、新しい ID で利用者側リポジトリの設定を書き換える。そのため `database_id` はダミー値（`00000000-0000-0000-0000-000000000000`）のままにする。実在の ID・`account_id`・`routes` はコミットしない。
- Workers Builds は `package.json` の `build` と `deploy` を実行する。`deploy` でマイグレーションを流しており、対象は DB 名ではなくバインディング名 `DB` を指定している（利用者が DB 名を変えても動くように）。
- `package.json` の `cloudflare.bindings` の説明文がボタンの設定画面に表示される。
- `workers_dev: true` で公開し、独自ドメインは利用者がダッシュボードで追加する（README の手順 A〜C）。
- ボタンはリポジトリが public でないと使えない。
- 店舗固有の値（店名・住所・URL・カレンダーID・写真の取得元など）はリポジトリに入れない。必要な値はすべて `0002_seed.sql` のプレースホルダーにする。

## 内容の変更方法

- 公開後の内容変更は D1 で行う（`npx wrangler d1 execute DB --remote --command "…"`、または README の画面手順）。`0002_seed.sql` は初回のマイグレーションでしか使われないので、編集しても公開済みのサイトには反映されない。
- スキーマ変更は `migrations/0004_xxx.sql` のように新しいファイルを追加する。既存のマイグレーションは書き換えない（適用済みの環境とずれる）。
- `site_settings` にキーを足すときは、`src/content.ts` の `SETTING_KEYS` にも追加する（無いキーは空文字になる）。
- 写真の R2 キーは、利用者がダッシュボードからそのままアップロードできるよう、フォルダ無しのファイル名（`hero.jpg`、`facility-01.jpg`〜`facility-09.jpg`）にしている。
- README の利用者向け手順と食い違う変更をしたら、README も合わせて直す。

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
