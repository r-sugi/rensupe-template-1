-- 写真の取得元。R2に無いキーは初回アクセス時にここから取得してR2へ保存する
-- （ここに無いキーは外部取得せず、グレーのプレースホルダーを表示する）

CREATE TABLE image_sources (
  r2_key TEXT PRIMARY KEY,
  url    TEXT NOT NULL
);

-- 既存サイトの写真を流用する場合の例：
-- INSERT INTO image_sources (r2_key, url) VALUES
--   ('hero.jpg',        'https://[既存サイト]/path/to/hero.jpg'),
--   ('facility-01.jpg', 'https://[既存サイト]/path/to/01.jpg');
