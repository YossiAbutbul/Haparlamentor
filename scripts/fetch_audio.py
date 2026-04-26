"""
Download audio for one Mako short via HLS manifest URL.

Usage:
    python scripts/fetch_audio.py <vcmId> <m3u8-url>

How to get the m3u8:
    1. Open the short page in browser, hit play
    2. F12 -> Network -> filter "m3u8"
    3. Right-click first .m3u8 entry -> Copy URL
    4. Paste as second arg

Writes:
    scripts/audio/<vcmId>.mp3

Then run:
    python scripts/transcribe.py <vcmId> scripts/audio/<vcmId>.mp3
"""

import io
import subprocess
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent
AUDIO = REPO_ROOT / "scripts" / "audio"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("Usage: python scripts/fetch_audio.py <vcmId> <m3u8-url>")
    vcm = sys.argv[1]
    m3u8 = sys.argv[2]
    AUDIO.mkdir(parents=True, exist_ok=True)
    out = AUDIO / f"{vcm}.mp3"

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--no-warnings",
        "--user-agent", UA,
        "--add-header", "Referer: https://www.mako.co.il/",
        "-x", "--audio-format", "mp3", "--audio-quality", "0",
        "-o", str(out.with_suffix("")),
        m3u8,
    ]
    print(" ".join(cmd))
    rc = subprocess.call(cmd)
    if rc != 0:
        sys.exit(rc)
    print(f"wrote {out.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
