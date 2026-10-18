/** D1からLPの内容を読み込む */

export const SETTING_KEYS = [
  "meta_title",
  "meta_description",
  "brand_name",
  "brand_mark",
  "hero_title_a",
  "hero_title_b",
  "hero_copy",
  "hero_image_key",
  "features_title",
  "facility_lead",
  "price_lead",
  "availability_lead",
  "availability_note",
  "calendar_embed_url",
  "access_lead",
  "address",
  "hours",
  "station",
  "map_url",
  "map_embed_url",
  "reservation_url",
  "law_url",
  "floating_cta_label",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type Settings = Record<SettingKey, string>;

export type Feature = { title: string; body: string };
export type Photo = { r2_key: string; alt: string; caption: string };
export type Price = { tag: string; title: string; amount: number; note: string };
export type Step = { title: string; body: string };
export type Faq = { question: string; answer: string };

export type Content = {
  settings: Settings;
  features: Feature[];
  specs: string[];
  photos: Photo[];
  prices: Price[];
  steps: Step[];
  faqs: Faq[];
};

export async function loadContent(db: D1Database): Promise<Content> {
  const [settingRows, features, specs, photos, prices, steps, faqs] = await db.batch([
    db.prepare("SELECT key, value FROM site_settings"),
    db.prepare("SELECT title, body FROM features ORDER BY sort, id"),
    db.prepare("SELECT label FROM facility_specs ORDER BY sort, id"),
    db.prepare("SELECT r2_key, alt, caption FROM facility_photos ORDER BY sort, id"),
    db.prepare("SELECT tag, title, amount, note FROM prices ORDER BY sort, id"),
    db.prepare("SELECT title, body FROM steps ORDER BY sort, id"),
    db.prepare("SELECT question, answer FROM faqs ORDER BY sort, id"),
  ]);

  const map = new Map(
    (settingRows!.results as { key: string; value: string }[]).map((r) => [r.key, r.value]),
  );
  const settings = Object.fromEntries(SETTING_KEYS.map((k) => [k, map.get(k) ?? ""])) as Settings;

  return {
    settings,
    features: features!.results as Feature[],
    specs: (specs!.results as { label: string }[]).map((r) => r.label),
    photos: photos!.results as Photo[],
    prices: prices!.results as Price[],
    steps: steps!.results as Step[],
    faqs: faqs!.results as Faq[],
  };
}

/** R2のキーを配信URLに変換 */
export const imageUrl = (key: string) => `/images/${key.split("/").map(encodeURIComponent).join("/")}`;
