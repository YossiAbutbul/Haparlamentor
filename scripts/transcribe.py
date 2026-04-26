"""
Transcribe one Mako short MP3 with Whisper, write to data/sN/transcripts/<vcmId>.txt.

Usage:
    python scripts/transcribe.py <vcmId> <path-to-mp3>

Auto-detects season from data/s*/shorts.json. Writes plain-text format:
    MM:SS  text

After transcribing, run:
    python scripts/build_db.py

Notes:
    - Model "large-v3" downloads ~3GB on first run (HF cache).
    - GPU auto-used if CUDA available; otherwise CPU.
    - No speaker labels. Add manually as `MM:SS [name]  text` if desired.
"""

import io
import json
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(
    sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True
)
sys.stderr = io.TextIOWrapper(
    sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True
)

from faster_whisper import WhisperModel

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA = REPO_ROOT / "data"
MODEL_NAME = "large-v3"


def find_season(vcm_id: str) -> int:
    for season_dir in sorted(DATA.glob("s*")):
        meta = json.loads((season_dir / "shorts.json").read_text(encoding="utf-8"))
        if any(s["vcmId"] == vcm_id for s in meta):
            return int(season_dir.name[1:])
    sys.exit(f"vcmId not found in any season: {vcm_id}")


def fmt_time(t: float) -> str:
    total = int(t)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def transcribe(mp3_path: Path) -> list[tuple[float, str]]:
    model = WhisperModel(MODEL_NAME, device="auto", compute_type="auto")
    segments, info = model.transcribe(
        str(mp3_path),
        language="he",
        vad_filter=True,
        beam_size=5,
        condition_on_previous_text=False,
    )
    print(f"detected language: {info.language} ({info.language_probability:.2f})")
    out = []
    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue
        out.append((seg.start, text))
        print(f"  [{fmt_time(seg.start)}] {text}")
    return out


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("Usage: python scripts/transcribe.py <vcmId> <path-to-mp3>")
    vcm_id = sys.argv[1]
    mp3 = Path(sys.argv[2])
    if not mp3.exists():
        sys.exit(f"MP3 not found: {mp3}")

    season = find_season(vcm_id)
    out_dir = DATA / f"s{season}" / "transcripts"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{vcm_id}.txt"

    cues = transcribe(mp3)
    out_path.write_text(
        "\n".join(f"{fmt_time(t)}  {text}" for t, text in cues) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {out_path.relative_to(REPO_ROOT)} ({len(cues)} cues)")
    print("Next: python scripts/build_db.py")


if __name__ == "__main__":
    main()
