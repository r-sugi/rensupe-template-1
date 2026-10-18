-- LPの初期データ
-- [ ] で囲んだ値は店舗ごとに置き換える。料金・FAQ・設備などの文面はサンプル

INSERT INTO site_settings (key, value) VALUES
  ('meta_title',        '[最寄り駅]のレンタルスタジオ [店名]｜24時間・1時間500円〜'),
  ('meta_description',  '[最寄り駅]徒歩[N]分。大型鏡・Bluetoothスピーカー・無料Wi-Fi完備の少人数向けレンタルスタジオ。24時間営業、会員登録不要、1時間500円から。'),
  ('brand_name',        'レンタルスタジオ [店名]'),
  ('brand_mark',        'R'),
  ('hero_title_a',      '[最寄り駅]徒歩[N]分・'),
  ('hero_title_b',      '24時間営業'),
  ('hero_copy',         '大型鏡、Bluetoothスピーカー、無料Wi-Fiを完備。
ひとりでも、仲間とでも、気兼ねなく集中できる少人数向けレンタルスタジオです。'),
  ('hero_image_key',    'hero.jpg'),
  ('features_title',    '[店名]が選ばれる理由'),
  ('facility_lead',     '少人数で使いやすい[広さ]㎡のスタジオ。練習・撮影に必要な設備を無料でご利用いただけます。'),
  ('price_lead',        '登録料・月額料なし。表示価格はすべて税込です。'),
  ('availability_lead', 'カレンダーの「予定あり」と表示されている時間帯はご利用いただけません。空いている時間を確認してからご予約ください。'),
  ('availability_note', '※スマートフォンではカレンダーを左右にスクロールできます。カレンダーが表示されない場合は、予約画面からも空き状況を確認できます。'),
  -- Googleカレンダーの「設定と共有」→「カレンダーの統合」→「埋め込みコード」の src を入れる
  ('calendar_embed_url','https://calendar.google.com/calendar/embed?src=[CALENDAR_ID]&ctz=Asia%2FTokyo&mode=WEEK&showTitle=0&showTabs=0&showCalendars=0&showTz=0'),
  ('access_lead',       '[最寄り駅]から徒歩[N]分'),
  ('address',           '[都道府県市区町村 番地]
[建物名・階]'),
  ('hours',             '24時間・365日'),
  ('station',           '[路線名][最寄り駅]から徒歩[N]分'),
  ('map_url',           'https://www.google.com/maps/search/?api=1&query=[住所をURLエンコード]'),
  ('map_embed_url',     'https://www.google.com/maps?q=[住所をURLエンコード]&output=embed'),
  ('reservation_url',   'https://[予約ページのURL]'),
  ('law_url',           'https://[特定商取引法に基づく表記のURL]'),
  ('floating_cta_label','空き状況・予約はこちら');

INSERT INTO features (sort, title, body) VALUES
  (1, '[最寄り駅]徒歩[N]分', '分かりやすい立地'),
  (2, '当日予約OK',         '会員登録なし・1時間から'),
  (3, '24時間営業',         '1時間500円から'),
  (4, '設備無料',           '大型鏡・Wi-Fi・スピーカー');

INSERT INTO facility_specs (sort, label) VALUES
  (1, '広さ [広さ]㎡'),
  (2, '大型鏡 [幅]m'),
  (3, '無料Wi-Fi'),
  (4, '24時間');

-- r2_key と同じファイル名の写真を R2 バケットにアップロードする（または 0003 の image_sources に取得元を登録する）
INSERT INTO facility_photos (sort, r2_key, alt, caption) VALUES
  (1, 'facility-01.jpg', '大型鏡を備えたスタジオ室内', 'スタジオ全景・大型ミラー'),
  (2, 'facility-02.jpg', '別角度から見たスタジオ室内', 'プライベート空間'),
  (3, 'facility-03.jpg', 'Bluetoothスピーカー',        'Bluetoothスピーカー'),
  (4, 'facility-04.jpg', '空気清浄機',                 '空気清浄機'),
  (5, 'facility-05.jpg', 'スマートフォン撮影用三脚',   'スマホ撮影用三脚'),
  (6, 'facility-06.jpg', '椅子',                       '椅子 2脚'),
  (7, 'facility-07.jpg', '掃除用モップ',               'セルフクリーニング用品'),
  (8, 'facility-08.jpg', '靴置き場とスリッパ',         '靴置き場・スリッパ'),
  (9, 'facility-09.jpg', 'CDプレーヤー',               'CDプレーヤー');

INSERT INTO prices (sort, tag, title, amount, note) VALUES
  (1, '平日 9:00–18:00',       '平日・日中',     900,  '平日18:00〜24:00は1時間1,100円'),
  (2, '深夜・早朝 0:00–9:00',  '深夜・早朝',     500,  'ひとり練習や朝活におすすめの最安プラン'),
  (3, '土日 9:00–24:00',       '土曜日・日曜日', 1300, '1〜3名程度の練習にちょうどいい広さ');

INSERT INTO steps (sort, title, body) VALUES
  (1, 'ウェブから予約',     '空き状況を確認し、希望日時と利用時間を選びます。'),
  (2, 'オンラインで支払い', 'クレジットカード・PayPay・銀行振込から選択できます。'),
  (3, 'キーボックスで入室', '予約後の案内を確認し、当日は鍵を取り出して入室します。'),
  (4, '清掃して退室',       '利用後はセルフクリーニング。鍵を戻したら完了です。');

INSERT INTO faqs (sort, question, answer) VALUES
  (1, '当日の予約はできますか？',       '空きがあれば当日・直前でも予約できます。予約画面から空き状況をご確認ください。'),
  (2, 'ダンス以外にも利用できますか？', 'ヨガ、トレーニング、ポージング、演劇練習、撮影など、さまざまな用途で利用できます。'),
  (3, '何人くらいで使えますか？',       '[広さ]㎡のスタジオで、ダンスなら1〜3名程度が目安です。2名なら広々と利用できます。'),
  (4, '室内シューズは必要ですか？',     '靴下・スリッパ・室内シューズでご利用ください。床を傷つける靴や黒い跡が付く靴はご遠慮ください。'),
  (5, 'キャンセル料金はかかりますか？', '予約日の6〜2日前は50%、前日・当日は100%のキャンセル料が発生します。'),
  (6, '駐車場・駐輪場はありますか？',   '入口前に無料駐輪スペースがあります。車の場合は近隣のコインパーキングをご利用ください。');
