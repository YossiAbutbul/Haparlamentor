import type { Episode, SearchHit } from "./types";

// Phase 1 stub: substring + naive normalization. Phase 2 swap to Fuse.js.
function normalize(s: string): string {
  return s
    .replace(/["'״׳`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function search(query: string, episodes: Episode[]): SearchHit[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];
  for (const ep of episodes) {
    for (let i = 0; i < ep.lines.length; i++) {
      const line = ep.lines[i];
      const text = normalize(line.text);
      if (text.includes(q)) {
        hits.push({
          episode: ep,
          lineIndex: i,
          line,
          context: {
            before: ep.lines[i - 1],
            after: ep.lines[i + 1],
          },
          score: 1 - q.length / Math.max(text.length, q.length),
        });
      }
    }
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 50);
}

export function makoLink(makoUrl: string, t: number): string {
  const sep = makoUrl.includes("?") ? "&" : "?";
  return `${makoUrl}${sep}t=${Math.floor(t)}`;
}

export function fmtTimestamp(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function fmtEpisodeTag(season: number, episode: number, t: number): string {
  const ss = season.toString().padStart(2, "0");
  const ee = episode.toString().padStart(2, "0");
  return `S${ss} · E${ee} · ${fmtTimestamp(t)}`;
}
