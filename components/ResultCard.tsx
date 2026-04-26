import type { SearchHit } from "@/lib/types";
import { makoLink } from "@/lib/search";

function highlight(text: string, query: string) {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="match">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function ResultCard({ hit, query }: { hit: SearchHit; query: string }) {
  const link = makoLink(hit.episode.makoUrl, hit.line.t);
  const ss = String(hit.episode.season).padStart(2, "0");
  const ee = String(hit.episode.episode).padStart(2, "0");
  const part = hit.line.part || hit.episode.title;

  return (
    <article
      className="group/card no-text-shadow relative rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-[1px] h-full"
      style={{
        background: "rgba(28,42,48,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow:
          "inset 0 0 0 1px rgba(241,233,200,0.14), 0 12px 28px -16px rgba(0,0,0,0.6)",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-y-5 start-0 w-px bg-accent-red origin-top scale-y-0 group-hover/card:scale-y-100 transition-transform duration-500 ease-out"
      />

      <div className="px-6 md:px-9 py-6 md:py-7 text-phosphor grid grid-cols-[1fr_auto] gap-6 md:gap-8 items-center">
        <div className="min-w-0">
          {/* meta row */}
          <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
            <div className="flex items-baseline gap-3 min-w-0 flex-wrap">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-phosphor/60 tabular-nums">
                S{ss}·E{ee}
              </span>
              {part && (
                <>
                  <span aria-hidden className="text-phosphor/25 select-none">⁄</span>
                  <span
                    className="font-display text-[15px] md:text-base font-semibold text-phosphor truncate"
                    dir="rtl"
                  >
                    {part}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* dialogue */}
          <p
            className="font-display text-[22px] md:text-[26px] leading-[1.45] font-medium"
            dir="rtl"
          >
            {highlight(hit.line.text, query)}
          </p>

          {/* context */}
          {(hit.context.before || hit.context.after) && (
            <div className="mt-4 space-y-1 text-[15px] text-phosphor/45" dir="rtl">
              {hit.context.before && (
                <p className="truncate">{hit.context.before.text}</p>
              )}
              {hit.context.after && (
                <p className="truncate">{hit.context.after.text}</p>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="group/cta inline-flex items-center gap-2 rounded-md px-4 py-2 font-display text-[13px] font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap hover:brightness-110"
            style={{
              background: "var(--color-accent-red)",
              color: "var(--color-phosphor)",
              border: "1px solid var(--color-accent-red)",
            }}
          >
            <span>פתח במאקו</span>
            <span aria-hidden className="text-[14px]">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
