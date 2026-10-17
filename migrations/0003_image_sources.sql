-- 写真の取得元。R2に無いキーは初回アクセス時にここから取得してR2へ保存する
-- （ここに無いキーは外部取得しない）

CREATE TABLE image_sources (
  r2_key TEXT PRIMARY KEY,
  url    TEXT NOT NULL
);

INSERT INTO image_sources (r2_key, url) VALUES
  ('hero/IMGL0306__220306-5.png',             'https://studio-povit.com/wp-content/uploads/2022/11/IMGL0306__220306-5.png'),
  ('facility/IMGL0309__220306-1.png',         'https://studio-povit.com/wp-content/uploads/2022/03/IMGL0309__220306-1.png'),
  ('facility/IMGL0311__220306-1.png',         'https://studio-povit.com/wp-content/uploads/2022/03/IMGL0311__220306-1.png'),
  ('facility/IMGL0306__220306-3.png',         'https://studio-povit.com/wp-content/uploads/2022/10/IMGL0306__220306-3.png'),
  ('facility/IMGL0295__220306.png',           'https://studio-povit.com/wp-content/uploads/2022/10/IMGL0295__220306.png'),
  ('facility/IMGL0289__220306-1.png',         'https://studio-povit.com/wp-content/uploads/2022/03/IMGL0289__220306-1.png'),
  ('facility/IMGL0305__220306.png',           'https://studio-povit.com/wp-content/uploads/2022/04/IMGL0305__220306.png'),
  ('facility/IMGL0312__220306.png',           'https://studio-povit.com/wp-content/uploads/2022/04/IMGL0312__220306.png'),
  ('facility/IMGL0303__220306.png',           'https://studio-povit.com/wp-content/uploads/2022/04/IMGL0303__220306.png'),
  ('facility/IMGL0338__220306-1536x1024.jpg', 'https://studio-povit.com/wp-content/uploads/2022/03/IMGL0338__220306-1536x1024.jpg');
