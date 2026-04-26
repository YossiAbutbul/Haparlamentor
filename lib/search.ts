import type { Short, SearchHit } from "./types";

function normalize(s: string): string {
  return s
    .replace(/["'״׳`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function search(query: string, shorts: Short[]): SearchHit[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];
  for (const sh of shorts) {
    for (let i = 0; i < sh.lines.length; i++) {
      const line = sh.lines[i];
      const text = normalize(line.text);
      if (text.includes(q)) {
        hits.push({
          short: sh,
          lineIndex: i,
          line,
          context: {
            before: sh.lines[i - 1],
            after: sh.lines[i + 1],
          },
          score: 1 - q.length / Math.max(text.length, q.length),
        });
      }
    }
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 50);
}

export function makoLink(short: Short, t: number): string {
  return `${short.url}#t=${Math.floor(t)}`;
}

export function fmtTimestamp(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
