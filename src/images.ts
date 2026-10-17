/**
 * R2の写真を配信する。
 * R2に無い場合は D1 の image_sources に登録された取得元から一度だけ取得してR2へ保存する。
 * 取得元も無ければグレーのプレースホルダーSVGを返す。
 */
export async function serveImage(env: Env, rawKey: string, reqHeaders: Headers): Promise<Response> {
  let key: string;
  try {
    key = decodeURIComponent(rawKey);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  if (!key || key.includes("..")) return new Response("Not Found", { status: 404 });

  const obj = await env.IMAGES.get(key, { onlyIf: reqHeaders });
  if (obj !== null) {
    const headers = baseHeaders(obj);
    // If-None-Match が一致した場合は body なしで返る
    if (!("body" in obj)) return new Response(null, { status: 304, headers });
    return new Response(obj.body, { headers });
  }

  const fetched = await fillFromSource(env, key);
  if (fetched) return fetched;
  return placeholder(key);
}

function baseHeaders(obj: R2Object): Headers {
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=86400, stale-while-revalidate=604800");
  return headers;
}

async function fillFromSource(env: Env, key: string): Promise<Response | null> {
  const row = await env.DB.prepare("SELECT url FROM image_sources WHERE r2_key = ?")
    .bind(key)
    .first<{ url: string }>();
  if (!row) return null;

  const res = await fetch(row.url);
  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok || !contentType.startsWith("image/")) {
    console.warn("image source unavailable", key, res.status, contentType);
    return null;
  }

  const body = await res.arrayBuffer();
  const saved = await env.IMAGES.put(key, body, { httpMetadata: { contentType } });
  return new Response(body, { headers: baseHeaders(saved) });
}

const escapeXml = (s: string) =>
  s.replace(/[<>&"']/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[ch]!);

function placeholder(key: string): Response {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
<rect width="1536" height="1024" fill="#e4e2de"/>
<text x="768" y="500" text-anchor="middle" font-family="sans-serif" font-size="44" letter-spacing="6" fill="#8a8780">PHOTO</text>
<text x="768" y="560" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#8a8780">${escapeXml(key)}</text>
</svg>`;
  return new Response(svg, {
    status: 404,
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "no-store" },
  });
}
