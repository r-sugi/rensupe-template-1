-- LPの内容を保持するテーブル群
-- sort の昇順で表示する

CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE features (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sort  INTEGER NOT NULL,
  title TEXT NOT NULL,
  body  TEXT NOT NULL
);

CREATE TABLE facility_specs (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sort  INTEGER NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE facility_photos (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  sort    INTEGER NOT NULL,
  r2_key  TEXT NOT NULL,
  alt     TEXT NOT NULL,
  caption TEXT NOT NULL
);

CREATE TABLE prices (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  sort   INTEGER NOT NULL,
  tag    TEXT NOT NULL,     -- 例: 平日 9:00–18:00
  title  TEXT NOT NULL,     -- 例: 平日・日中
  amount INTEGER NOT NULL,  -- 税込・円/1時間
  note   TEXT NOT NULL
);

CREATE TABLE steps (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sort  INTEGER NOT NULL,
  title TEXT NOT NULL,
  body  TEXT NOT NULL
);

CREATE TABLE faqs (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  sort     INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer   TEXT NOT NULL
);

CREATE INDEX idx_features_sort        ON features(sort);
CREATE INDEX idx_facility_specs_sort  ON facility_specs(sort);
CREATE INDEX idx_facility_photos_sort ON facility_photos(sort);
CREATE INDEX idx_prices_sort          ON prices(sort);
CREATE INDEX idx_steps_sort           ON steps(sort);
CREATE INDEX idx_faqs_sort            ON faqs(sort);
