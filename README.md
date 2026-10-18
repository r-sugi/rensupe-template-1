# レンタルスペース LP テンプレート

レンタルスタジオ・レンタルスペースの集客用ホームページ（1ページ）を、**ボタンひとつで自分の Cloudflare に公開できる**テンプレートです。プログラミングの知識やパソコンへのインストールは不要で、すべてブラウザの画面操作だけで進められます。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/r-sugi/rensupe-template-1)

---

## 公開までの流れ（約10分）

| | やること | 所要時間 |
| --- | --- | --- |
| 準備 | GitHub と Cloudflare のアカウントを作る | 5分 |
| 手順1 | Cloudflare で「R2」を有効にする | 2分 |
| 手順2 | 「Deploy to Cloudflare」ボタンを押す | 3分 |
| 手順3 | 表示されたURLを開いて確認する | 1分 |

公開直後のページには `[店名]` `[最寄り駅]` のような仮の文字と、グレーの仮写真が表示されます。そのあと「[自分のお店の内容に変える](#自分のお店の内容に変える)」の手順で書き換えてください。

### 準備：アカウントを作る

どちらも無料です。すでに持っている場合は飛ばしてください。

[![GitHub アカウント作成](https://img.shields.io/badge/GitHub-%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E4%BD%9C%E6%88%90-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/signup)
[![Cloudflare アカウント作成](https://img.shields.io/badge/Cloudflare-%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E4%BD%9C%E6%88%90-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/sign-up)

- **GitHub**：ホームページの元になるファイルを保管する場所です。
- **Cloudflare**：ホームページを公開する場所です。

### 手順1：R2（写真の保管場所）を有効にする

[![R2 を有効化する](https://img.shields.io/badge/R2-%E6%9C%89%E5%8A%B9%E5%8C%96%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/r2/overview)

1. 上のボタンを押し、Cloudflare にログインします。
2. R2 の画面で「購入」または「R2 を有効にする」を押します。
3. 支払い方法（クレジットカードなど）の登録を求められるので、登録します。

> 💡 **料金について**：R2 には毎月の無料枠があり、このホームページの写真程度なら無料枠の範囲に収まります。支払い方法の登録は、R2 を使うための必須手続きです。

**この手順を飛ばすと、手順2が途中で失敗します。**

### 手順2：「Deploy to Cloudflare」ボタンを押す

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/r-sugi/rensupe-template-1)

1. 上のボタンを押します。
2. **「GitHub に接続」** を押し、表示される画面で GitHub へのアクセスを許可します。
   - あなたの GitHub に、このテンプレートのコピーが作られます。
3. 設定画面が表示されます。**何も変えずに**、一番下の **「作成してデプロイ」**（Create and deploy）を押します。
   - 名前を変えたい場合だけ、「プロジェクト名」を半角英数字とハイフンで書き換えてください（例：`my-studio`）。
   - データベース（D1）と写真の保管場所（R2）は自動で作られます。
4. 2〜3分ほど待ちます。「成功」と表示されれば完了です。

### 手順3：公開されたページを開く

完了画面に表示される `https://〜.workers.dev` のURLを開きます。仮の文字と仮写真のページが表示されれば成功です。

> 💡 このURLは、あとから Cloudflare の「Workers & Pages」画面でいつでも確認できます。

---

## 自分のお店の内容に変える

内容の書き換えも、すべて Cloudflare の画面で行います。**ホームページを作り直す必要はありません。** 保存すると、1分ほどでページに反映されます。

### 文章・料金・よくある質問を変える

[![D1 で内容を編集する](https://img.shields.io/badge/D1-%E5%86%85%E5%AE%B9%E3%82%92%E7%B7%A8%E9%9B%86%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/workers/d1)

1. 上のボタンを押し、データベース **`rensupe-lp`** を開きます（手順2で名前を変えた場合はその名前）。
2. 「コンソール」（Console）タブを開きます。
3. 下の「お店の基本情報」のSQLをコピーし、`[ ]` の部分を自分のお店の内容に書き換えます。
4. コンソールに貼り付けて「実行」（Execute）を押します。
5. ホームページを再読み込みして、内容が変わったことを確認します。

**お店の基本情報（最初に必ず書き換える部分）**

```sql
UPDATE site_settings SET value = 'レンタルスタジオ [店名]' WHERE key = 'brand_name';
UPDATE site_settings SET value = '[店名の頭文字1文字]' WHERE key = 'brand_mark';
UPDATE site_settings SET value = '[最寄り駅]のレンタルスタジオ [店名]｜24時間・1時間500円〜' WHERE key = 'meta_title';
UPDATE site_settings SET value = '[最寄り駅]徒歩[N]分・' WHERE key = 'hero_title_a';
UPDATE site_settings SET value = '[店名]が選ばれる理由' WHERE key = 'features_title';
UPDATE site_settings SET value = '[最寄り駅]から徒歩[N]分' WHERE key = 'access_lead';
UPDATE site_settings SET value = '[住所]' WHERE key = 'address';
UPDATE site_settings SET value = '[路線名][最寄り駅]から徒歩[N]分' WHERE key = 'station';
UPDATE site_settings SET value = 'https://[予約ページのURL]' WHERE key = 'reservation_url';
UPDATE site_settings SET value = 'https://[特定商取引法に基づく表記のURL]' WHERE key = 'law_url';
UPDATE features SET title = '[最寄り駅]徒歩[N]分' WHERE sort = 1;
```

**料金を変える**（例：平日・日中を1,000円に）

```sql
UPDATE prices SET amount = 1000 WHERE title = '平日・日中';
```

**よくある質問を追加する**

```sql
INSERT INTO faqs (sort, question, answer) VALUES (7, '更衣室はありますか？', 'ございません。動きやすい服装でお越しください。');
```

**よくある質問を削除する**（例：上から6番目）

```sql
DELETE FROM faqs WHERE sort = 6;
```

> 💡 データベースの画面に「テーブル」（Tables）タブがある場合は、`site_settings` などの表を開き、値を直接書き換えることもできます。

<details>
<summary>書き換えられる項目の一覧（site_settings）</summary>

| key | 表示される場所 |
| --- | --- |
| `meta_title` | ブラウザのタブ・検索結果のタイトル |
| `meta_description` | 検索結果の説明文 |
| `brand_name` | ヘッダー・フッターの店名 |
| `brand_mark` | ロゴの四角の中の1文字 |
| `hero_title_a` / `hero_title_b` | トップの大見出し（2つ合わせて1行。スマホでは2つの間で改行） |
| `hero_copy` | トップの説明文 |
| `hero_image_key` | トップの写真のファイル名 |
| `features_title` | 「選ばれる理由」の見出し |
| `facility_lead` | 「スタジオと設備」の説明文 |
| `price_lead` | 「ご利用料金」の説明文 |
| `availability_lead` / `availability_note` | 「空き状況」の説明文・注意書き |
| `calendar_embed_url` | 空き状況に表示する Google カレンダー |
| `access_lead` / `address` / `hours` / `station` | 「アクセス」の内容 |
| `map_url` / `map_embed_url` | 地図ボタンのリンク先・表示する地図 |
| `reservation_url` | 「予約する」ボタンのリンク先 |
| `law_url` | フッターの「特定商取引法に基づく表記」のリンク先 |
| `floating_cta_label` | スマホ画面下の予約ボタンの文字 |

そのほかの表：`features`（選ばれる理由）、`facility_specs`（設備のタグ）、`facility_photos`（設備写真）、`prices`（料金）、`steps`（ご利用方法）、`faqs`（よくある質問）。どれも `sort` の小さい順に表示されます。

</details>

### 写真を入れる

[![R2 に写真を入れる](https://img.shields.io/badge/R2-%E5%86%99%E7%9C%9F%E3%82%92%E5%85%A5%E3%82%8C%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/r2/overview)

1. 写真のファイル名を、下の表のとおりに変えておきます（**すべて半角小文字**、拡張子は `.jpg`）。
2. 上のボタンを押し、バケット **`rensupe-lp-images`** を開きます。
3. 「アップロード」（Upload）を押し、写真をまとめてドラッグ＆ドロップします。
4. ホームページを再読み込みすると、グレーの仮写真が本物に置き換わります。

| ファイル名 | 表示される場所 |
| --- | --- |
| `hero.jpg` | トップの大きな写真（横長がおすすめ） |
| `facility-01.jpg` 〜 `facility-09.jpg` | 「スタジオと設備」の写真（9枚。縦横比 3:2 がおすすめ） |

> 💡 写真の説明文（キャプション）を変えたい場合は、データベースの `facility_photos` 表の `caption` を書き換えます。
> 例：`UPDATE facility_photos SET caption = '大型ミラー' WHERE sort = 1;`

### 空き状況のカレンダーを表示する

1. [Google カレンダー](https://calendar.google.com/) を開き、左の一覧で予約用カレンダーの「︙」→「設定と共有」を開きます。
2. 「アクセス権限」で「一般公開して誰でも利用できるようにする」をオンにします（「予定の表示（時間枠のみ、詳細は非表示）」を選ぶと、予定の中身は見えません）。
3. 「カレンダーの統合」の「埋め込みコード」にある `src="〜"` の **〜の部分** をコピーします。
4. D1 のコンソールで次を実行します。

```sql
UPDATE site_settings SET value = '[コピーしたURL]' WHERE key = 'calendar_embed_url';
```

### 地図を表示する

住所を入れた次のSQLを実行します。`[住所]` の部分は、そのまま日本語で入れて大丈夫です。

```sql
UPDATE site_settings SET value = 'https://www.google.com/maps?q=[住所]&output=embed' WHERE key = 'map_embed_url';
UPDATE site_settings SET value = 'https://www.google.com/maps/search/?api=1&query=[住所]' WHERE key = 'map_url';
```

### 独自ドメイン（例：`example.com`）で公開する

[![Workers のドメイン設定](https://img.shields.io/badge/Workers-%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E8%A8%AD%E5%AE%9A-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

ドメインが Cloudflare に登録済みであることが前提です。

1. 上のボタンを押し、`rensupe-lp`（手順2で付けた名前）を開きます。
2. 「設定」（Settings）→「ドメインとルート」（Domains & Routes）→「追加」（Add）→「カスタムドメイン」（Custom domain）を選びます。
3. 公開したいドメインを入力して追加します。数分で、そのドメインでも表示されるようになります。

---

## うまくいかないとき

| 症状 | 原因と対処 |
| --- | --- |
| 手順2が途中で失敗する（R2 に関するエラー） | R2 が有効になっていません。手順1を行ってから、Cloudflare の「Workers & Pages」でこのプロジェクトを開き、デプロイを再実行してください |
| 写真がグレーのまま | ファイル名が表と違う（大文字や `.jpeg` など）か、別のバケットに入れています。ファイル名とバケット名を確認してください |
| 書き換えた内容が出ない | 反映まで最大1分かかります。少し待ってから再読み込みしてください |
| カレンダーが出ない | カレンダーが一般公開になっていないか、`calendar_embed_url` に `src="` や `"` まで含めて貼っています |
| GitHub のファイルを書き換えたら、ページが元に戻った | GitHub のファイルを変更すると自動で再公開されます。`migrations` フォルダのファイルは最初の1回しか使われないので、内容の変更は必ずデータベース（D1）で行ってください |

---

<details>
<summary><b>開発者向けの情報</b>（ボタンを使わずに手元から操作する場合）</summary>

### 構成

| 役割 | 使うもの |
| --- | --- |
| SSR | Cloudflare Workers + Hono 4.13.13（JSX） |
| CSS | Tailwind CSS 4.3.3（`@tailwindcss/cli` でビルドし、静的アセットとして配信） |
| 内容 | D1（バインディング `DB`） |
| 写真 | R2（バインディング `IMAGES`、`/images/<key>` で配信） |
| ツール | Wrangler 4.151.1 / TypeScript 7.0.2 |

```
src/
  index.tsx             ルーティング（/ と /images/*）
  content.ts            D1読み込み（1リクエスト1バッチ）
  images.ts             R2配信（ETag/304対応、未登録なら image_sources から取得して保存、無ければプレースホルダー）
  styles.css            Tailwind v4 のテーマ＝デザイントークン
  components/
    layout.tsx          head・ヘッダー・フッター・スマホ固定CTA
    sections.tsx        ヒーロー〜アクセスの各セクション
    ui.tsx              ロゴ・ボタン・見出しなどの部品
migrations/
  0001_init.sql         スキーマ
  0002_seed.sql         初期データ（[ ] がプレースホルダー）
  0003_image_sources.sql 写真の取得元テーブル（任意）
scripts/
  release.sh            CLIでの初回リリース（D1・R2作成 → マイグレーション → デプロイ）
```

### Deploy to Cloudflare ボタンの仕組み

- Cloudflare が `wrangler.jsonc` を読み、D1・R2 を作成して、新しい ID で設定を書き換えます（`database_id` の `00000000-…` はそのためのダミー値）。
- Workers Builds が `package.json` の `build`（CSS ビルド）と `deploy`（マイグレーション → `wrangler deploy`）を実行します。マイグレーションはバインディング名 `DB` を指定しているので、利用者がDB名を変えても動きます。
- `package.json` の `cloudflare.bindings` に書いた説明文が、ボタンの設定画面に表示されます。
- ボタンを使うにはリポジトリが public である必要があります。

### CLI でのセットアップとデプロイ

```bash
npm ci
npm run cf-typegen   # worker-configuration.d.ts（型）を生成
npx wrangler login
npm run release      # 初回：D1・R2を作成し database_id を書き込んでデプロイ
npm run deploy       # 2回目以降：CSSビルド → マイグレーション → デプロイ
```

`node_modules` には OS ごとのバイナリ（workerd、Tailwind）が入るため、実行するマシンでインストールしてください。

### ローカル開発

```bash
npm run db:migrate:local
npm run dev                 # http://localhost:8787
```

### CLI での内容・写真の更新

```bash
npx wrangler d1 execute DB --remote --command "UPDATE prices SET amount = 1000 WHERE title = '平日・日中'"
npx wrangler r2 object put rensupe-lp-images/hero.jpg --file ./hero.jpg --content-type image/jpeg --remote
```

スキーマ変更は `migrations/0004_xxx.sql` のように新しいファイルを追加すると、次のデプロイで適用されます。既存サイトの写真を流用する場合は、`image_sources` にキーと取得元 URL を登録すると、R2 に無い写真を初回アクセス時に取得して保存します。

### デザイントークン（`src/styles.css` の `@theme`）

- 色：`ink #4a4a4a` / `paper #fff` / `soft #fafafa` / `accent #ffd447` / `line #e5e5e5` / `muted #727272`
- フォント：本文 `Noto Sans JP`、数字・ロゴ `DM Sans`
- 幅：`--container-site: 1180px`（左右余白 SP 14px / それ以上 20px）
- ブレークポイント：`md` = 621px〜、`lg` = 901px〜（モバイルファースト）

### レイアウト

- PC（901px〜）：ヘッダー1行、写真3列、料金3列、ステップ4列（間に →）
- タブレット（621〜900px）：ヘッダー2段（ロゴ／横スクロールのリンク）、写真2列、ステップ2列
- スマホ（〜620px）：すべて1列（ステップの間に ↓）、画面下に固定の予約ボタン

</details>
