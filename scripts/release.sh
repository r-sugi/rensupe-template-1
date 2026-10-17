#!/usr/bin/env bash
# Povit LP を karibako.com にリリースする（何度実行しても安全）
set -euo pipefail
cd "$(dirname "$0")/.."

DB_NAME="povit-lp"
BUCKET="povit-lp-images"
URL="https://karibako.com"

step() { printf '\n\033[1;33m▶ %s\033[0m\n' "$1"; }

step "1/6 Cloudflare認証"
if ! npx wrangler whoami 2>/dev/null | grep -q "You are logged in"; then
  npx wrangler login
fi
npx wrangler whoami 2>/dev/null | grep -E "logged in|9a93e379" || true

db_id() {
  npx wrangler d1 list --json 2>/dev/null | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const l=JSON.parse(s);const d=l.find(x=>x.name===process.argv[1]);
      process.stdout.write(d?d.uuid:"");})' "$DB_NAME"
}

step "2/6 D1データベース"
ID="$(db_id)"
if [ -z "$ID" ]; then
  npx wrangler d1 create "$DB_NAME" >/dev/null
  ID="$(db_id)"
fi
[ -n "$ID" ] || { echo "D1のIDを取得できませんでした"; exit 1; }
node -e '
  const fs=require("fs");const f="wrangler.jsonc";
  const s=fs.readFileSync(f,"utf8").replace(/("database_id":\s*")[^"]*(")/,`$1${process.argv[1]}$2`);
  fs.writeFileSync(f,s);' "$ID"
echo "database_id = $ID"

step "3/6 R2バケット"
if npx wrangler r2 bucket list 2>/dev/null | grep -q "$BUCKET"; then
  echo "$BUCKET は作成済み"
else
  npx wrangler r2 bucket create "$BUCKET"
fi

step "4/6 マイグレーション（テーブル作成と内容の投入）"
CI=1 npx wrangler d1 migrations apply "$DB_NAME" --remote

step "5/6 デプロイ（karibako.com に割り当て）"
npm run deploy

step "6/6 表示確認"
for i in 1 2 3 4 5 6; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$URL/" || true)"
  [ "$code" = "200" ] && break
  sleep 5
done
echo "$URL/ → HTTP $code"
img="$(curl -s -o /dev/null -w '%{http_code} %{content_type}' "$URL/images/hero/IMGL0306__220306-5.png" || true)"
echo "ヒーロー画像 → $img"
echo
echo "完了：$URL"
