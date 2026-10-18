import type { Content, Settings } from "../content";
import { imageUrl } from "../content";
import { Button, Lead, lines, linkTo, Section, SectionName } from "./ui";

const pad2 = (n: number) => String(n).padStart(2, "0");
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** ファーストビュー */
export const Hero = ({ s }: { s: Settings }) => (
  <section class="relative grid min-h-[780px] place-items-center overflow-hidden bg-[#171717] text-white md:min-h-[760px]">
    <div
      aria-hidden="true"
      class="absolute inset-0 scale-[1.015] bg-cover bg-center bg-no-repeat"
      style={`background-image:url("${imageUrl(s.hero_image_key)}")`}
    />
    <div class="relative z-[2] min-h-[780px] w-[min(calc(100%-40px),var(--container-site))] pt-[160px] pb-7 md:min-h-[760px] md:pt-[170px] lg:pt-[180px] lg:pb-[54px]">
      {/* 「・」の位置で折り返すよう2つに分ける（現行は「24／時間営業」で改行されていた） */}
      <h1 class="hero-text-shadow absolute top-[46%] left-1/2 m-0 w-[min(100%,1100px)] -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(2.1rem,10vw,3.4rem)] leading-[1.08] font-bold tracking-[-.045em] text-balance md:text-[clamp(2.35rem,5vw,5rem)]">
        <span class="inline-block">{s.hero_title_a}</span>
        <span class="inline-block">{s.hero_title_b}</span>
      </h1>
      <div class="absolute right-0 bottom-6 left-0 max-w-[720px] md:bottom-7 lg:bottom-[42px]">
        <p class="hero-copy-shadow mb-[14px] text-[.92rem] leading-[1.7] font-bold text-white md:text-[clamp(1rem,2vw,1.22rem)] md:leading-[1.9]">
          {lines(s.hero_copy)}
        </p>
      </div>
    </div>
    <span aria-hidden="true" class="absolute right-0 bottom-0 h-1 w-[34%] bg-accent" />
  </section>
);

/** 選ばれる理由 */
export const Features = ({ c }: { c: Content }) => (
  <section id="features" class="border-b border-line bg-white pt-[34px] pb-[38px]">
    <div class="wrap">
      <h2 class="mb-5 text-center text-[.72rem] font-bold tracking-[.16em] text-sub">
        {c.settings.features_title}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4">
        {c.features.map((f, i) => (
          <article class="grid grid-cols-[34px_1fr] items-start gap-[10px] border-b border-line px-1 py-[14px] last:border-b-0 md:border-r md:border-b-0 md:px-[22px] md:py-0 md:last:border-r-0">
            <div class="font-display text-[1.2rem] font-bold text-accent">{pad2(i + 1)}</div>
            <div>
              <h3 class="mb-[3px] text-[.9rem] leading-[1.45] font-bold">{f.title}</h3>
              <p class="m-0 text-[.72rem] leading-[1.65] text-faint">{f.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/** スタジオと設備 */
export const Facility = ({ c }: { c: Content }) => (
  <Section id="facility">
    <div class="mb-[34px] grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto]">
      <div>
        <SectionName>スタジオと設備</SectionName>
        <Lead>{c.settings.facility_lead}</Lead>
      </div>
      <ul class="m-0 flex list-none flex-wrap justify-start gap-2 p-0 md:justify-end">
        {c.specs.map((label) => (
          <li class="border border-[#ddd] bg-white px-[13px] py-[7px] text-[.8rem] font-semibold">{label}</li>
        ))}
      </ul>
    </div>
    <div
      aria-hidden="true"
      class="mt-3 mb-[46px] h-1 bg-[linear-gradient(90deg,var(--color-accent)_0_29%,var(--color-rule)_29%_100%)]"
    />
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[22px] lg:grid-cols-3">
      {c.photos.map((p) => (
        <figure class="group m-0">
          <img
            src={imageUrl(p.r2_key)}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            width="1536"
            height="1024"
            class="aspect-[3/2] bg-[#eee] object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.015]"
          />
          <figcaption class="px-[2px] pt-[10px] text-[.82rem] text-caption">{p.caption}</figcaption>
        </figure>
      ))}
    </div>
  </Section>
);

/** ご利用料金 */
export const Pricing = ({ c }: { c: Content }) => (
  <Section id="price" soft>
    <div class="mb-11 lg:flex lg:items-end lg:justify-between lg:gap-8">
      <div>
        <SectionName>ご利用料金</SectionName>
        <Lead>{c.settings.price_lead}</Lead>
      </div>
      <Button {...linkTo(c.settings.reservation_url, "予約ページ")} variant="ghost" class="mt-5 lg:mt-0">
        空き状況を見る
      </Button>
    </div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {c.prices.map((p) => (
        <article class="relative border border-line bg-white pb-7 text-center">
          <span aria-hidden="true" class="block h-1 bg-accent" />
          <span class="mb-7 block bg-tag px-[10px] py-[18px] text-[.9rem] font-bold">{p.tag}</span>
          <h3 class="mb-1 text-base font-bold">{p.title}</h3>
          <div class="mt-2 mb-4 font-display text-5xl leading-none font-bold">
            {yen(p.amount)}
            <small class="font-sans text-[.8rem]"> / 1時間</small>
          </div>
          <p class="m-0 px-[22px] text-[.88rem] text-sub">{p.note}</p>
        </article>
      ))}
    </div>
  </Section>
);

/** 空き状況（Googleカレンダー） */
export const Availability = ({ s }: { s: Settings }) => (
  <Section id="availability">
    <SectionName>空き状況</SectionName>
    <Lead>{s.availability_lead}</Lead>
    <div class="mt-7 border border-[#d9d9d9] bg-calendar p-2 shadow-card md:p-[14px]">
      <div class="overflow-x-auto bg-white [-webkit-overflow-scrolling:touch]">
        <iframe
          title={`${s.brand_name}の空き状況`}
          loading="lazy"
          src={s.calendar_embed_url}
          class="block h-[620px] w-full min-w-[760px] border-0 md:h-[680px]"
        />
      </div>
    </div>
    <p class="mt-4 mb-0 text-[.82rem] text-sub">{s.availability_note}</p>
    <div class="mt-[22px] flex flex-wrap gap-3">
      <Button {...linkTo(s.reservation_url, "予約ページ")} variant="yellow" class="w-full md:w-auto">
        予約する
      </Button>
    </div>
  </Section>
);

const arrow = "absolute z-[2] text-[2rem] leading-none font-black text-accent arrow-outline";

/** ご利用方法 */
export const Flow = ({ c }: { c: Content }) => (
  <Section id="flow">
    <SectionName>ご利用方法</SectionName>
    <ol class="mt-11 grid list-none grid-cols-1 gap-[42px] p-0 md:grid-cols-2 md:gap-[18px] lg:grid-cols-4">
      {c.steps.map((st, i) => {
        const last = i === c.steps.length - 1;
        return (
          <li class="relative border-t-4 border-ink bg-white px-[22px] py-7 shadow-step">
            <div
              aria-hidden="true"
              class={`mt-[-4px] mb-[30px] ml-[2px] grid size-[52px] place-items-center rounded-full border-2 border-ink bg-accent font-display text-[1.55rem] leading-none font-bold text-ink shadow-badge ${
                i % 2 === 0 ? "-rotate-[4deg]" : "rotate-[4deg]"
              }`}
            >
              {i + 1}
            </div>
            <h3 class="mb-2 text-[1.02rem] font-bold">{st.title}</h3>
            <p class="m-0 text-[.86rem] text-muted">{st.body}</p>
            {!last && (
              <>
                <span aria-hidden="true" class={`${arrow} right-1/2 bottom-[-35px] translate-x-1/2 md:hidden`}>
                  ↓
                </span>
                <span aria-hidden="true" class={`${arrow} top-1/2 right-[-25px] hidden -translate-y-1/2 lg:block`}>
                  →
                </span>
              </>
            )}
          </li>
        );
      })}
    </ol>
  </Section>
);

/** よくある質問 */
export const FaqList = ({ c }: { c: Content }) => (
  <Section id="faq">
    <SectionName>よくある質問</SectionName>
    <div class="mx-auto mt-11 max-w-[860px] border-t border-line">
      {c.faqs.map((f) => (
        <details class="group border-b border-line">
          <summary class="relative cursor-pointer py-6 pr-[50px] font-bold">
            {f.question}
            <span aria-hidden="true" class="absolute right-0 text-[1.4rem] font-normal">
              <span class="group-open:hidden">＋</span>
              <span class="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p class="m-0 pr-[35px] pb-6 text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);

/** アクセス */
export const Access = ({ s }: { s: Settings }) => (
  <Section id="access" soft>
    <SectionName>アクセス</SectionName>
    <div class="grid grid-cols-1 items-center gap-[60px] lg:grid-cols-[.8fr_1.2fr]">
      <div class="py-7 text-ink md:py-[30px]">
        <p class="mb-[26px] text-[1.25rem] font-extrabold">{s.access_lead}</p>
        <dl class="my-7 grid grid-cols-1 gap-1 md:grid-cols-[80px_1fr] md:gap-x-5 md:gap-y-4">
          <dt class="text-[.82rem] text-faint">住所</dt>
          <dd class="m-0 mb-3 font-semibold md:mb-0">{lines(s.address)}</dd>
          <dt class="text-[.82rem] text-faint">営業時間</dt>
          <dd class="m-0 mb-3 font-semibold md:mb-0">{s.hours}</dd>
          <dt class="text-[.82rem] text-faint">最寄り駅</dt>
          <dd class="m-0 mb-3 font-semibold md:mb-0">{s.station}</dd>
        </dl>
        <Button href={s.map_url} variant="yellow" external>
          Googleマップを開く
        </Button>
      </div>
      <div class="min-h-[360px] overflow-hidden rounded-3xl bg-[#ddd] shadow-card lg:min-h-[460px]">
        <iframe
          title={`${s.brand_name} 周辺地図`}
          loading="lazy"
          src={s.map_embed_url}
          class="block h-[360px] w-full border-0 lg:h-[460px]"
        />
      </div>
    </div>
  </Section>
);
