#!/usr/bin/env python3
"""Apply safe Whisper-mishearing fixes to Hebrew S1 transcripts.

Idempotent: re-running on already-fixed text is a no-op.
"""
from __future__ import annotations

import argparse
import io
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
TRANSCRIPTS_DIR = ROOT / "data" / "s1" / "transcripts"
FIXES_FILE = Path(__file__).resolve().parent / "transcript_fixes.json"

HEBREW_CHAR_CLASS = r"[֐-׿‏‎]"


def compile_pattern(token: str) -> re.Pattern:
    # Right boundary only: forbid following Hebrew char (so אקטור doesn't match אקטורי).
    # Left side is unbounded so prefixes (ה/ב/ל/מ/ש/ו/כ + variant) are caught and rewritten.
    return re.compile(rf"{re.escape(token)}(?!{HEBREW_CHAR_CLASS})")


def load_fixes():
    with FIXES_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def apply_to_text(text: str, replacements: dict[str, str]):
    counts = {}
    for src, dst in replacements.items():
        pat = compile_pattern(src)
        new_text, n = pat.subn(dst, text)
        if n:
            counts[src] = n
            text = new_text
    return text, counts


def report_review_only(files: list[Path], review: dict[str, str]):
    print("=== review_only matches (manual triage) ===")
    found_any = False
    for f in files:
        text = f.read_text(encoding="utf-8")
        for token, note in review.items():
            pat = compile_pattern(token)
            hits = list(pat.finditer(text))
            if hits:
                found_any = True
                lines = text.splitlines()
                hit_lines = []
                for m in hits:
                    line_no = text[: m.start()].count("\n") + 1
                    hit_lines.append(f"L{line_no}: {lines[line_no - 1].strip()}")
                print(f"  {f.name}  [{token} → {note}]")
                for hl in hit_lines:
                    print(f"    {hl}")
    if not found_any:
        print("  (none)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--report", action="store_true", help="print review_only matches")
    args = ap.parse_args()

    fixes = load_fixes()
    skip = set(fixes["skip_files"])
    safe = fixes["safe_replacements"]
    review = fixes.get("review_only", {})

    all_files = sorted(TRANSCRIPTS_DIR.glob("*.txt"))
    target_files = [f for f in all_files if f.name not in skip]

    print(f"transcripts dir: {TRANSCRIPTS_DIR}")
    print(f"total: {len(all_files)}  skipping: {len(skip)}  processing: {len(target_files)}")
    print(f"mode: {'DRY-RUN' if args.dry_run else 'APPLY'}")
    print()

    grand_total = {k: 0 for k in safe}
    changed_files = 0

    for f in target_files:
        text = f.read_text(encoding="utf-8")
        new_text, counts = apply_to_text(text, safe)
        if counts:
            changed_files += 1
            for k, v in counts.items():
                grand_total[k] += v
            summary = ", ".join(f"{k}→{safe[k]}×{v}" for k, v in counts.items())
            print(f"  {f.name}: {summary}")
            if not args.dry_run:
                f.write_text(new_text, encoding="utf-8")

    print()
    print(f"files changed: {changed_files}")
    print("totals:")
    for k, v in grand_total.items():
        if v:
            print(f"  {k} → {safe[k]}: {v}")

    if args.report:
        print()
        report_review_only(target_files, review)


if __name__ == "__main__":
    sys.exit(main())
