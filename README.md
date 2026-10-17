# Povit LP（Cloudflare Workers 版）

`minpaku-ma.myspe.net/page/va7978bOUrYM` の LP を、Cloudflare Workers（SSR）＋ D1 ＋ R2 で作り直したものです。

- 本番：https://karibako.com （Workers の Custom Domain。`workers.dev` は無効）
- Cloudflare アカウント ID：`9a93e379d73896df4f9234ac783ad6cb`（`wrangler.jsonc` に設定済み）

| 役割 | 使うもの |
| --- | --- |
| SSR | Workers + Hono 4.13.13（JSX） |
| CSS | Tailwind CSS 4.3.3（`@tailwindcss/cli` でビルドし、静的アセットとして配信） |
| 内容 | D1 `povit-lp`（料金・FAQ・設備・特徴・ステップ・各種文言/URL） |
| 写真 | R2 `povit-lp-images`（`/images/<key>` で配信） |
| ツール | Wrangler 4.151.1 / TypeScript 7.0.2 |

## セットアップ

```bash
npm ci
npm run cf-typegen   # worker-configuration.d.ts（型）を生成
npx wrangler login
```

`node_modules` には OS ごとのバイナリ（workerd、Tailwind）が入るため、実行するマシンでインストールしてください。別の OS で入れたものをコピーすると `You installed workerd on another platform` で失敗します（その場合は `rm -rf node_modules && npm ci`）。

## デプロイ

```bash
npm run deploy   # CSS ビルド → wrangler deploy
```

### ゼロから作る場合（別アカウントへの移設など）

```bash
npm run release
```

`scripts/release.sh` が次を順に行います。何度実行しても安全です。

1. wrangler の認証確認（未ログインなら `wrangler login`）
2. D1 `povit-lp` を作成（既存なら再利用）し、`database_id` を `wrangler.jsonc` に書き込む
3. R2 `povit-lp-images` を作成（既存ならスキップ。R2 未有効のアカウントはダッシュボードで有効化が必要）
4. マイグレーション適用（テーブル作成と内容の投入）
5. デプロイして karibako.com に割り当て（既存の DNS レコードがある場合は上書きせずエラーで止まる）
6. トップページとヒーロー画像の表示確認

## 写真

R2 にキーが無い写真は、初回アクセス時に Worker が `image_sources` テーブルの取得元（studio-povit.com）から取得して R2 に保存し、以降は R2 から配信します。`image_sources` にも無いキーは、グレーのプレースホルダー（HTTP 404）になります。

手動で R2 に入れたい場合は `npm run images:sync:remote`（ローカルは `:local`）を使います。

### 差し替え

```bash
npx wrangler r2 object put povit-lp-images/facility/new.jpg --file ./new.jpg --content-type image/jpeg --remote
npx wrangler d1 execute povit-lp --remote \
  --command "UPDATE facility_photos SET r2_key = 'facility/new.jpg' WHERE sort = 3"
```

ヒーロー画像は `site_settings` の `hero_image_key` で指定します。

## 内容の更新（D1）

表示順は各テーブルの `sort` 昇順です。トップページは `Cache-Control: max-age=60` のため、反映がブラウザで最大1分遅れることがあります。

```bash
# 料金を変更
npx wrangler d1 execute povit-lp --remote \
  --command "UPDATE prices SET amount = 1000 WHERE title = '平日・日中'"

# FAQを追加
npx wrangler d1 execute povit-lp --remote \
  --command "INSERT INTO faqs (sort, question, answer) VALUES (7, '更衣室はありますか？', '…')"

# 予約ボタンのリンク先を変更
npx wrangler d1 execute povit-lp --remote \
  --command "UPDATE site_settings SET value = 'https://page.line.me/293ftlxc' WHERE key = 'reservation_url'"
```

スキーマを変えるときは `migrations/0004_xxx.sql` のように新しいファイルを追加し、`npm run db:migrate:remote` で適用します。

| テーブル | 中身 |
| --- | --- |
| `site_settings` | タイトル、説明文、ヒーロー文言・画像キー、各セクションのリード文、住所、カレンダー/地図/予約/特商法のURL など（key-value） |
| `features` | 選ばれる理由（4件） |
| `facility_specs` | 設備のタグ（広さ 17㎡ など） |
| `facility_photos` | 設備写真（R2キー・alt・キャプション） |
| `prices` | 料金カード（金額は税込・円） |
| `steps` | ご利用方法 |
| `faqs` | よくある質問 |
| `image_sources` | R2 に無い写真の取得元 URL |

## ローカル開発

```bash
npm run db:migrate:local
npm run dev                 # http://localhost:8787
```

写真はローカルでも、ネットにつながっていれば初回表示時に取得元から自動で保存されます。

`wrangler.jsonc` を変更したら `npm run cf-typegen` で型（`worker-configuration.d.ts`）を作り直してください。

## 構成

```
src/
  index.tsx             ルーティング（/ と /images/*）
  content.ts            D1読み込み（1リクエスト1バッチ）
  images.ts             R2配信（ETag/304対応、未登録なら取得元から保存、無ければプレースホルダー）
  styles.css            Tailwind v4 のテーマ＝デザイントークン
  components/
    layout.tsx          head・ヘッダー・フッター・スマホ固定CTA
    sections.tsx        ヒーロー〜アクセスの各セクション
    ui.tsx              ロゴ・ボタン・見出しなどの部品
migrations/
  0001_init.sql         スキーマ
  0002_seed.sql         現行LPの内容
  0003_image_sources.sql 写真の取得元
scripts/
  release.sh            ゼロからのリリース一式
  sync-images.sh        写真の取得とR2アップロード（手動用）
```

## デザイントークン（`src/styles.css` の `@theme`）

- 色：`ink #4a4a4a` / `paper #fff` / `soft #fafafa` / `accent #ffd447` / `line #e5e5e5` / `muted #727272`
- フォント：本文 `Noto Sans JP`、数字・ロゴ `DM Sans`
- 幅：`--container-site: 1180px`（左右余白 SP 14px / それ以上 20px）
- ブレークポイント：現行CSSの `max-width: 620px / 900px` に合わせ、`md` = 621px〜、`lg` = 901px〜

## 現行LPから直した点（見た目・文言は同一）

- スマホ（〜620px）のヘッダーが高さ70pxに潰れていた → 自動高さに。画面下の固定CTAと重なる「予約する」はスマホでは非表示
- アンカーで飛んだときの位置ずれ（`scroll-margin` と `scroll-padding` の二重指定） → ヘッダーの実高さに合わせて一本化
- H1が「…24／時間営業」で改行されていた → 「・」の位置で折り返す
- フッターのロゴ枠が背景と同色で見えなかった → 白に
- 使われていないCSS（`.final-cta` など）は移植していない
- 見出しを `<p>` から `<h2>`、ステップを `<ol>` にするなど、見た目を変えずにマークアップを整理
