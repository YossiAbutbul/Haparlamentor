import type { SearchHit } from "@/lib/types";
import { ResultCard } from "./ResultCard";

export function ResultsList({
  hits,
  query,
}: {
  hits: SearchHit[];
  query: string;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3 font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-phosphor/85">
        <span
          className="inline-block h-1.5 w-1.5"
          style={{ background: "var(--color-accent-teal)" }}
        />
        <span>תוצאות · {hits.length}</span>
        <span className="flex-1 h-px bg-phosphor/15" />
      </div>
      {hits.map((h, i) => (
        <ResultCard
          key={`${h.episode.id}-${h.lineIndex}-${i}`}
          hit={h}
          query={query}
        />
      ))}
    </div>
  );
}
