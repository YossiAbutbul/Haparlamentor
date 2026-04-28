from __future__ import annotations

"""
Build runtime DB from data/ directory.

Reads:
    data/s<N>/shorts.json              # array of { vcmId, title, url, duration }
    data/s<N>/transcripts/<vcmId>.txt  # MM:SS [speaker] text  (one cue per line)

Writes:
    public/data/db.json                # { seasons: [{ season, shorts: [{ ..., lines }] }] }

Run from repo root:
    python scripts/build_db.py

Transcript line format:
    MM:SS  text                  -> { t: 65.0, text }
    HH:MM:SS  text               -> handles long shorts
    MM:SS [שאולי]  text           -> { t, speaker: "שאולי", text }
    # comment line                 -> ignored
    blank line                    -> ignored
"""

import io
import json
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA = REPO_ROOT / "data"
OUT = REPO_ROOT / "public" / "data" / "db.json"

CUE_RE = re.compile(
    r"""^
    (?:(?P<h>\d+):)?(?P<m>\d{1,2}):(?P<s>\d{2})(?:\.(?P<ms>\d{1,3}))?
    \s+
    (?:\[(?P<speaker>[^\]]+)\]\s+)?
    (?P<text>.+?)
    \s*$""",
    re.VERBOSE,
)


def parse_transcript(path: Path) -> list[dict]:
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = CUE_RE.match(line)
        if not m:
            print(f"  WARN: skipped unparseable line in {path.name}: {line!r}")
            continue
        h = int(m.group("h") or 0)
        mm = int(m.group("m"))
        s = int(m.group("s"))
        ms = int((m.group("ms") or "0").ljust(3, "0")[:3])
        t = h * 3600 + mm * 60 + s + ms / 1000
        cue = {"t": round(t, 2), "text": m.group("text").strip()}
        if m.group("speaker"):
            cue["speaker"] = m.group("speaker").strip()
        lines.append(cue)
    return lines


def build() -> dict:
    seasons = []
    for season_dir in sorted(DATA.glob("s*")):
        if not season_dir.is_dir():
            continue
        season_num = int(season_dir.name[1:])
        shorts_meta = json.loads((season_dir / "shorts.json").read_text(encoding="utf-8"))
        transcripts_dir = season_dir / "transcripts"
        out_shorts = []
        for sh in shorts_meta:
            vcm = sh["vcmId"]
            txt = transcripts_dir / f"{vcm}.txt"
            lines = parse_transcript(txt) if txt.exists() else []
            out_shorts.append(
                {
                    "vcmId": vcm,
                    "title": sh["title"],
                    "url": sh["url"],
                    "duration": sh.get("duration", ""),
                    "season": season_num,
                    "lines": lines,
                }
            )
        seasons.append({"season": season_num, "shorts": out_shorts})
        with_lines = sum(1 for s in out_shorts if s["lines"])
        print(f"season {season_num}: {len(out_shorts)} shorts, {with_lines} transcribed")
    return {"seasons": seasons}


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    db = build()
    OUT.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
