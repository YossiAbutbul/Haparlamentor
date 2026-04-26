"""
Batch fetch + transcribe for all shorts in a season that have an m3u8 URL.

Reads:
    data/s<N>/m3u8.json   { "<vcmId>": "<m3u8 url>", ... }
    data/s<N>/shorts.json (for vcmId list)

For each entry in m3u8.json:
    - skip if data/s<N>/transcripts/<vcmId>.txt already exists
    - download audio to scripts/audio/<vcmId>.mp3 (or .ts if no ffmpeg) if missing
    - transcribe -> data/s<N>/transcripts/<vcmId>.txt

Then rebuilds public/data/db.json.

Usage:
    python scripts/batch_run.py 1
"""

import io
import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(
    sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True
)
sys.stderr = io.TextIOWrapper(
    sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True
)

REPO_ROOT = Path(__file__).resolve().parent.parent
AUDIO = REPO_ROOT / "scripts" / "audio"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
)


def find_audio(vcm: str) -> Path | None:
    for ext in (".mp3", ".m4a", ".ts", ".aac"):
        p = AUDIO / f"{vcm}{ext}"
        if p.exists():
            return p
    return None


def download(vcm: str, m3u8: str) -> Path:
    AUDIO.mkdir(parents=True, exist_ok=True)
    out_base = AUDIO / vcm
    has_ffmpeg = shutil.which("ffmpeg") is not None

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--no-warnings",
        "--user-agent", UA,
        "--add-header", "Referer: https://www.mako.co.il/",
        "-o", str(out_base),
        m3u8,
    ]
    if has_ffmpeg:
        cmd[7:7] = ["-x", "--audio-format", "mp3", "--audio-quality", "0"]

    print(f"  downloading {vcm}")
    rc = subprocess.call(cmd)
    if rc != 0:
        sys.exit(f"yt-dlp failed for {vcm} (exit {rc})")

    found = find_audio(vcm)
    if not found:
        # yt-dlp without ffmpeg saves the raw segment with its native extension
        # (.ts, .mp4, etc). Sometimes it has no extension.
        for cand in AUDIO.iterdir():
            if cand.stem == vcm and cand.suffix:
                return cand
        # fallback: append .ts to extensionless file
        bare = AUDIO / vcm
        if bare.exists() and bare.is_file():
            renamed = bare.with_suffix(".ts")
            bare.rename(renamed)
            return renamed
        sys.exit(f"could not locate downloaded audio for {vcm}")
    return found


def transcribe(vcm: str, audio: Path) -> None:
    cmd = [
        sys.executable, "-u",
        str(REPO_ROOT / "scripts" / "transcribe.py"),
        vcm,
        str(audio),
    ]
    env = {
        **__import__("os").environ,
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUNBUFFERED": "1",
    }
    rc = subprocess.call(cmd, env=env)
    if rc != 0:
        sys.exit(f"transcribe failed for {vcm} (exit {rc})")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Usage: python scripts/batch_run.py <season_number>")
    season = int(sys.argv[1])
    season_dir = REPO_ROOT / "data" / f"s{season}"
    m3u8_path = season_dir / "m3u8.json"
    transcripts_dir = season_dir / "transcripts"

    if not m3u8_path.exists():
        sys.exit(f"missing {m3u8_path.relative_to(REPO_ROOT)}")
    transcripts_dir.mkdir(parents=True, exist_ok=True)

    mapping = json.loads(m3u8_path.read_text(encoding="utf-8"))
    print(f"season {season}: {len(mapping)} m3u8 entries")

    done = 0
    skipped = 0
    for vcm, url in mapping.items():
        txt = transcripts_dir / f"{vcm}.txt"
        if txt.exists():
            print(f"  [skip] {vcm} (transcript exists)")
            skipped += 1
            continue
        audio = find_audio(vcm) or download(vcm, url)
        transcribe(vcm, audio)
        done += 1

    print(f"done: {done} new, {skipped} skipped")

    print("rebuilding db.json")
    rc = subprocess.call(
        [sys.executable, str(REPO_ROOT / "scripts" / "build_db.py")],
        env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"},
    )
    sys.exit(rc)


if __name__ == "__main__":
    main()
