-- content/photos から R2 にアップロード済みの写真のハッシュ。
-- 同期スクリプトが、変わった写真だけをアップロードするために使う。
CREATE TABLE content_assets (
  r2_key TEXT PRIMARY KEY,
  sha256 TEXT NOT NULL
);
