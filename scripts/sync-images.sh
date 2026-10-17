#!/usr/bin/env bash
# 現行サイト（studio-povit.com）から写真を取得し、R2バケットに入れる
#   npm run images:sync:local   … wrangler dev 用のローカルR2へ
#   npm run images:sync:remote  … 本番R2へ
set -euo pipefail

TARGET="${1:---local}"
case "$TARGET" in --local|--remote) ;; *) echo "usage: $0 [--local|--remote]" >&2; exit 1 ;; esac

BUCKET="povit-lp-images"
SRC="https://studio-povit.com/wp-content/uploads"
DIR="$(cd "$(dirname "$0")/.." && pwd)/.images"
mkdir -p "$DIR"

# R2キー  元画像のパス
IMAGES=(
  "hero/IMGL0306__220306-5.png              2022/11/IMGL0306__220306-5.png"
  "facility/IMGL0309__220306-1.png          2022/03/IMGL0309__220306-1.png"
  "facility/IMGL0311__220306-1.png          2022/03/IMGL0311__220306-1.png"
  "facility/IMGL0306__220306-3.png          2022/10/IMGL0306__220306-3.png"
  "facility/IMGL0295__220306.png            2022/10/IMGL0295__220306.png"
  "facility/IMGL0289__220306-1.png          2022/03/IMGL0289__220306-1.png"
  "facility/IMGL0305__220306.png            2022/04/IMGL0305__220306.png"
  "facility/IMGL0312__220306.png            2022/04/IMGL0312__220306.png"
  "facility/IMGL0303__220306.png            2022/04/IMGL0303__220306.png"
  "facility/IMGL0338__220306-1536x1024.jpg  2022/03/IMGL0338__220306-1536x1024.jpg"
)

for row in "${IMAGES[@]}"; do
  read -r key path <<<"$row"
  file="$DIR/$(basename "$key")"
  if [[ ! -s "$file" ]]; then
    echo "↓ $path"
    curl -fsSL -o "$file" "$SRC/$path"
  fi
  case "$file" in
    *.png) type="image/png" ;;
    *.jpg|*.jpeg) type="image/jpeg" ;;
    *.webp) type="image/webp" ;;
    *) type="application/octet-stream" ;;
  esac
  echo "↑ $BUCKET/$key ($TARGET)"
  npx wrangler r2 object put "$BUCKET/$key" --file "$file" --content-type "$type" "$TARGET" >/dev/null
done

echo "完了：${#IMAGES[@]}枚を $BUCKET にアップロードしました"
