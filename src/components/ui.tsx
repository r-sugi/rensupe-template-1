import type { Child, PropsWithChildren } from "hono/jsx";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** 改行を<br>に変換 */
export const lines = (text: string): Child[] =>
  text.split("\n").flatMap((line, i) => (i === 0 ? [line] : [<br />, line]));

/** ロゴ（ヘッダー／フッター共通） */
export const Brand = ({ name, dark = false }: { name: string; dark?: boolean }) => (
  <a
    href="#top"
    aria-label="Povit トップへ"
    class="flex items-center gap-3 whitespace-nowrap font-display text-[1.15rem] font-bold tracking-[.06em] md:text-[1.5rem]"
  >
    <span
      class={cx(
        "grid size-9 place-items-center rounded-xl border-2 text-[1.4rem] text-accent md:size-[42px]",
        // 現行は濃色背景でも枠線がinkで見えなかったため、フッターでは白に修正
        dark ? "border-white/80" : "border-ink",
      )}
    >
      P
    </span>
    {name}
  </a>
);

type ButtonProps = PropsWithChildren<{
  href: string;
  variant?: "ink" | "yellow" | "ghost";
  class?: string;
  external?: boolean;
}>;

/** 角丸なし・高さ54pxのボタン */
export const Button = ({ href, variant = "ink", class: extra, external, children }: ButtonProps) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener" } : {})}
    class={cx(
      "inline-flex min-h-[54px] items-center justify-center rounded-none border px-[30px] font-bold transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-btn",
      variant === "ink" && "border-ink bg-ink text-white",
      variant === "yellow" && "border-accent bg-accent text-[#333]",
      variant === "ghost" && "border-ink bg-transparent text-ink",
      extra,
    )}
  >
    {children}
  </a>
);

/** セクション見出し（左に黄色バー） */
export const SectionName = ({ children }: PropsWithChildren) => (
  <h2 class="mb-[14px] flex items-center gap-[11px] text-[clamp(1.35rem,2.5vw,2rem)] font-extrabold leading-[1.3] tracking-[-.025em]">
    <span aria-hidden="true" class="h-1 w-[30px] shrink-0 bg-accent" />
    {children}
  </h2>
);

export const Lead = ({ children }: PropsWithChildren) => (
  <p class="mb-0 max-w-[680px] text-[1.05rem] text-lead">{children}</p>
);

export const Section = ({
  id,
  soft = false,
  children,
}: PropsWithChildren<{ id: string; soft?: boolean }>) => (
  <section id={id} class={cx("py-[72px] md:py-24", soft && "bg-soft")}>
    <div class="wrap">{children}</div>
  </section>
);
