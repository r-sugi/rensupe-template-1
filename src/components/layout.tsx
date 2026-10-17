import type { PropsWithChildren } from "hono/jsx";
import type { Settings } from "../content";
import { Brand } from "./ui";

const NAV = [
  ["#features", "特徴"],
  ["#facility", "設備"],
  ["#price", "料金"],
  ["#availability", "空き状況"],
  ["#flow", "ご利用方法"],
  ["#faq", "よくある質問"],
  ["#access", "アクセス"],
] as const;

const FOOTER_NAV = [
  ["#price", "料金"],
  ["#facility", "設備"],
  ["#availability", "空き状況"],
  ["#faq", "よくある質問"],
] as const;

export const Document = ({ s, children }: PropsWithChildren<{ s: Settings }>) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{s.meta_title}</title>
      <meta name="description" content={s.meta_description} />
      <meta name="theme-color" content="#111111" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/styles.css" />
    </head>
    <body>{children}</body>
  </html>
);

/**
 * ヘッダー
 * - PC（901px〜）：1行。リンクにホバーで黄色の下線
 * - タブレット（621〜900px）：ロゴ／横スクロールのリンクの2段、高さ112px
 * - スマホ（〜620px）：2段。現行は高さ70pxに潰れていたため自動高さに修正し、
 *   画面下の固定CTAと重複する「予約する」は隠す
 */
export const Header = ({ s }: { s: Settings }) => (
  <header class="fixed top-0 left-0 z-50 w-full border-b border-line bg-white/96 text-ink shadow-header backdrop-blur-md">
    <div class="wrap flex flex-col gap-1.5 py-2 md:grid md:h-[112px] md:grid-rows-2 md:gap-0 lg:flex lg:h-[76px] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-0">
      <div class="flex items-center">
        <Brand name={s.brand_name} />
      </div>
      <nav
        aria-label="メインメニュー"
        class="scrollbar-none flex w-full items-center gap-[18px] overflow-x-auto pb-[5px] text-[.82rem] font-bold whitespace-nowrap lg:w-auto lg:gap-5 lg:overflow-visible lg:pb-0"
      >
        {NAV.map(([href, label]) => (
          <a href={href} class="group relative py-1 lg:py-[25px]">
            {label}
            <span
              aria-hidden="true"
              class="absolute right-0 bottom-0 left-0 h-0.5 scale-x-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-x-100 lg:bottom-[17px]"
            />
          </a>
        ))}
        <a
          href={s.reservation_url}
          class="hidden min-h-[34px] items-center justify-center border border-accent bg-accent px-[15px] font-bold text-[#333] transition duration-200 hover:-translate-y-0.5 hover:shadow-btn md:inline-flex lg:min-h-[54px] lg:px-[30px]"
        >
          予約する
        </a>
      </nav>
    </div>
  </header>
);

export const Footer = ({ s }: { s: Settings }) => (
  <footer class="bg-ink pt-11 pb-[100px] text-white">
    <div class="wrap md:flex md:items-end md:justify-between md:gap-[30px]">
      <div>
        <Brand name={s.brand_name} dark />
        <p class="mt-3 mb-0 text-[.8rem] text-white/55">© {s.brand_name}</p>
      </div>
      <div class="mt-[25px] flex flex-wrap gap-[18px] text-[.78rem] md:mt-0">
        {FOOTER_NAV.map(([href, label]) => (
          <a href={href}>{label}</a>
        ))}
        <a href={s.law_url}>特定商取引法に基づく表記</a>
      </div>
    </div>
  </footer>
);

/** スマホのみ表示する画面下の固定CTA */
export const FloatingCta = ({ s }: { s: Settings }) => (
  <a
    href={s.reservation_url}
    class="fixed right-[14px] bottom-3 left-[14px] z-30 flex min-h-[58px] items-center justify-center rounded-full bg-accent px-6 font-black shadow-floating md:hidden"
  >
    {s.floating_cta_label}
  </a>
);
