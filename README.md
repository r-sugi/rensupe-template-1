# レンタルスペース LP テンプレート

レンタルスタジオ・レンタルスペースの集客用ホームページ（1ページ）を、**ボタンひとつで自分の Cloudflare に公開できる**テンプレートです。プログラミングの知識やパソコンへのインストールは不要で、すべてブラウザの画面操作だけで進められます。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/r-sugi/rensupe-template-1)

---

## 公開までの流れ（約20分）

| | やること | 所要時間 |
| --- | --- | --- |
| 準備 | GitHub と Cloudflare のアカウントを作り、パスキーなどを設定する | 10〜15分 |
| 手順1 | Cloudflare で「R2」を有効にする | 2分 |
| 手順2 | 「Deploy to Cloudflare」ボタンを押す | 3分 |
| 手順3 | 表示されたURLを開いて確認する | 1分 |

公開直後のページには `[店名]` `[最寄り駅]` のような仮の文字と、グレーの仮写真が表示されます。そのあと「[自分のお店の内容に変える](#自分のお店の内容に変える)」の手順で書き換えてください。

### 準備：アカウントを作る

GitHub と Cloudflare の2つのアカウントを作ります。どちらも無料で、それぞれ5分ほどです。すでに持っている場合は、パスキー（または2段階認証）の設定だけ確認してください。

| サービス | 役割 |
| --- | --- |
| **GitHub** | ホームページの元になるファイルを保管する場所。手順2で、このテンプレートのコピーがあなたの GitHub に作られます |
| **Cloudflare** | ホームページを公開する場所。写真や文章のデータもここに保存されます |

> 💡 **登録の前に用意するもの**
> - ふだん受信できるメールアドレス（確認メールが届きます。2つのサービスで同じアドレスで大丈夫です）
> - パスワードのメモ（ブラウザやスマホのパスワード保存機能を使うと安心です）
> - スマートフォンまたは指紋認証・顔認証のあるパソコン（パスキーの設定に使います）

#### GitHub に登録する

[![GitHub に登録する](https://img.shields.io/badge/GitHub-%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/signup)

1. 上のボタンを押します（英語の画面ですが、入力するのは3項目だけです）。
2. 次の3つを入力して進みます。
   - **Email**：メールアドレス
   - **Password**：パスワード（15文字以上、または数字と小文字を含む8文字以上）
   - **Username**：ユーザー名（半角英数字とハイフン。例：`studio-example`）
     - ユーザー名は、公開されるホームページの元ファイルの住所 `github.com/ユーザー名` に使われ、誰でも見られます。お店の名前など、公開してよい名前にしてください。
3. 人間であることの確認（簡単なパズル）が出たら、指示に従って解きます。
4. 登録したメールアドレスに **8桁の確認コード** が届くので、画面に入力します。
5. 使い方についての質問が表示されたら、「Skip personalization」（スキップ）で飛ばして構いません。プランを選ぶ画面が出た場合は **Free（無料）** を選びます。

#### GitHub にパスキーを設定する（おすすめ）

[![GitHub のパスキー設定を開く](https://img.shields.io/badge/GitHub-%E3%83%91%E3%82%B9%E3%82%AD%E3%83%BC%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/settings/security)

**パスキー**は、パスワードの代わりに、スマートフォンやパソコンの指紋認証・顔認証・画面ロックでログインできる仕組みです。パスワードを覚えたり入力したりする必要がなくなり、パスワードが盗まれる心配も減ります。

1. GitHub にログインした状態で、上のボタンを押します。
   - ボタンが使えないときは、右上の自分のアイコン →「Settings」→ 左側の「Password and authentication」を開きます。
2. 「Passkeys」の欄にある **「Add a passkey」** を押します。
3. パスワードの確認を求められたら入力します。
4. **「Add passkey」** を押すと、パソコンやスマートフォンの確認画面（指紋・顔・画面ロックのPINなど）が出るので、指示に従って認証します。
5. 名前を付ける画面が出たら、分かりやすい名前（例：「自宅のMac」「iPhone」）を付けて **「Done」** を押します。

次回からは、ログイン画面で「Sign in with a passkey」を選ぶと、指紋や顔だけでログインできます。

#### Cloudflare に登録する

[![Cloudflare に登録する](https://img.shields.io/badge/Cloudflare-%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/sign-up)

1. 上のボタンを押します。画面右上の言語の切り替えで「日本語」を選ぶと読みやすくなります。
2. **メールアドレス** と **パスワード** を入力して「サインアップ」を押します。
   - Google アカウントなどで登録するボタンがある場合は、それを使っても構いません。
3. 登録したメールアドレスに確認メールが届くので、メール内のリンクを押してメールアドレスを確認します。**確認しないと、手順1以降に進めません。**
4. 「何をしたいですか？」のような案内が表示されたら、スキップするか閉じて構いません。ダッシュボード（管理画面）が表示されれば登録完了です。

#### Cloudflare に指紋・顔認証の2段階認証を設定する（おすすめ）

[![Cloudflare の認証設定を開く](https://img.shields.io/badge/Cloudflare-%E8%AA%8D%E8%A8%BC%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/profile/authentication)

Cloudflare では「パスキー」という名前ではなく、**「セキュリティキー」による2段階認証**として、パソコンやスマートフォンの指紋認証・顔認証（Touch ID、Windows Hello など）を使えます。パスワードに加えて指紋や顔で確認するので、パスワードが盗まれてもログインされにくくなります。

1. Cloudflare にログインした状態で、上のボタンを押します。
   - ボタンが使えないときは、右上の人のアイコン →「マイプロフィール」→「認証」を開きます。
2. 「2要素認証」（Two-Factor Authentication）の **「設定」** を押します。
3. 「セキュリティキー」の **「追加」** を押し、Cloudflare のパスワードを入力して進みます。
4. パソコンの確認画面（指紋・顔・PINなど）が出るので、指示に従って認証します。
   - Windows で別の確認画面が先に出た場合は、一度キャンセルすると正しい画面が表示されます。
5. 名前（例：「自宅のPC」）を付けます。
6. **バックアップコード** が表示されます。指紋認証ができなくなったときにログインするための大切なコードなので、**印刷するか、パスワード管理アプリなど安全な場所に保存** してから「次へ」を押します。

> 💡 指紋・顔認証のないパソコンの場合は、同じ画面で「認証アプリ」（Google Authenticator など、スマートフォンのアプリに表示される6桁の数字で確認する方法）を選べます。

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

### 独自ドメインで公開する（任意）

#### 独自ドメインとは？

**ドメイン**は、インターネット上の「住所」にあたる文字列です。たとえば `https://studio-example.com` の `studio-example.com` の部分です。

ボタンで公開した直後のページは、`https://rensupe-lp.〇〇.workers.dev` のように Cloudflare から割り当てられた住所になります。これでも誰でも見られますが、**自分のお店専用の住所（独自ドメイン）**にすると、次のような良さがあります。

- お店の名前を入れた、覚えやすいURLにできる（例：`studio-example.com`）
- チラシや名刺、Googleマップに載せたときに信頼感が出る
- あとからホームページの作り方を変えても、同じURLを使い続けられる

独自ドメインは「ドメイン登録サービス」から借りるもので、**毎年の利用料**がかかります（料金はドメインの種類 `.com` `.jp` などで変わります）。使わない場合は、このまま `workers.dev` のURLで運用して問題ありません。

#### 進め方を選ぶ

| あなたの状況 | 進める手順 |
| --- | --- |
| ドメインをまだ持っていない | A → C |
| 他の会社（お名前.com、ムームードメインなど）でドメインを持っている | B → C |
| すでに Cloudflare でドメインを管理している | C だけ |

#### A. ドメインを新しく取る（Cloudflare で購入）

[![ドメインを登録する](https://img.shields.io/badge/Cloudflare-%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%82%92%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/domains/register)

1. 上のボタンを押し、欲しいドメイン名（例：`studio-example`）を入力して検索します。
2. 空いているドメインと年間の料金が表示されるので、選んで購入します。
3. 購入したドメインは、自動で Cloudflare の管理下に入ります。そのまま **C** に進んでください。

#### B. 他の会社で持っているドメインを Cloudflare につなぐ

[![ドメインを Cloudflare に追加する](https://img.shields.io/badge/Cloudflare-%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/add-site)

1. 上のボタンを押し、持っているドメイン（例：`studio-example.com`）を入力します。
2. プランは **Free（無料）** を選びます。
3. 今の設定（DNSレコード）が読み込まれるので、そのまま「続行」を押します。
4. **2つのネームサーバー**（`〇〇.ns.cloudflare.com` のような文字列）が表示されます。これをメモします。
5. ドメインを買った会社の管理画面を開き、「ネームサーバーの変更」で、今のネームサーバーを手順4の2つに書き換えます。
6. 切り替わると Cloudflare からメールが届きます（数分〜最大24時間ほど）。届いたら **C** に進んでください。

> ⚠️ **そのドメインでメールや別のホームページを使っている場合**：手順3で読み込まれた設定に、今使っているものがすべて入っているか確認してください。不安な場合は、ドメインを管理している人や業者に相談してから進めるのが安全です。

#### C. ホームページにドメインを割り当てる

[![Workers のドメイン設定](https://img.shields.io/badge/Workers-%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E8%A8%AD%E5%AE%9A-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

1. 上のボタンを押し、`rensupe-lp`（手順2で名前を変えた場合はその名前）を開きます。
2. 「設定」（Settings）→「ドメインとルート」（Domains & Routes）→「追加」（Add）→「カスタムドメイン」（Custom domain）を選びます。
3. 公開したいアドレスを入力して「ドメインを追加」を押します。
   - ドメインそのもので公開する：`studio-example.com`
   - ドメインの一部を使う（ほかのホームページと分けたいとき）：`lp.studio-example.com` など
4. 数分待ち、入力したアドレスをブラウザで開いてページが表示されれば完了です。安全な接続（`https://`）の設定は自動で行われます。

> 💡 独自ドメインを追加しても、`workers.dev` のURLも引き続き使えます。
> 💡 「すでにレコードがあります」のような表示が出て追加できない場合は、そのアドレスを別のホームページなどで使っています。上の 3. で `lp.` などを付けた別のアドレスにするか、ドメインの管理者に確認してください。

---

## うまくいかないとき

| 症状 | 原因と対処 |
| --- | --- |
| 手順2が途中で失敗する（R2 に関するエラー） | R2 が有効になっていません。手順1を行ってから、Cloudflare の「Workers & Pages」でこのプロジェクトを開き、デプロイを再実行してください |
| 写真がグレーのまま | ファイル名が表と違う（大文字や `.jpeg` など）か、別のバケットに入れています。ファイル名とバケット名を確認してください |
| 書き換えた内容が出ない | 反映まで最大1分かかります。少し待ってから再読み込みしてください |
| カレンダーが出ない | カレンダーが一般公開になっていないか、`calendar_embed_url` に `src="` や `"` まで含めて貼っています |
| 独自ドメインを開くと「このサイトにアクセスできません」 | ネームサーバーの切り替え（B）が終わっていないか、割り当て（C）から数分しか経っていません。時間をおいて再度開いてください |
| GitHub のファイルを書き換えたら、ページが元に戻った | GitHub のファイルを変更すると自動で再公開されます。`migrations` フォルダのファイルは最初の1回しか使われないので、内容の変更は必ずデータベース（D1）で行ってください |

---

## 開発者・AI 向けの情報

コードの構成、コマンドでのデプロイ方法、開発時の注意点は [CLAUDE.md](./CLAUDE.md) にまとめています。Claude Code などの AI にこのリポジトリの作業を頼むと、自動でこのファイルを読んで進めます。
