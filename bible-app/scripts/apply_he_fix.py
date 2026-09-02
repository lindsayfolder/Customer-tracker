#!/usr/bin/env python3
"""Apply targeted 他->祂 verse-text corrections to public/bible/zh-hant/<book>.json.

This exists so background agents doing the actual theological judgment call
(is this specific "他" referring to God, or to a person?) never touch JSON
serialization themselves — they only ever produce a mapping of "which verses
change to what full text", and this script is the single place that reads/
writes the book file, preserving its exact existing compact format
(ensure_ascii=False, separators=(",", ":")) so diffs are minimal and clean.

Usage:
  python3 scripts/apply_he_fix.py <book_id> /path/to/changes.json

changes.json shape: {"<chapter>:<verse>": "<full corrected verse text>", ...}
Only verses present in the mapping are touched; every other verse in the
book is left completely untouched (same object, same string).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOK_DIR = ROOT / "public" / "bible" / "zh-hant"


def main():
    if len(sys.argv) != 3:
        print("usage: apply_he_fix.py <book_id> <changes.json>", file=sys.stderr)
        sys.exit(1)
    book_id, changes_path = sys.argv[1], Path(sys.argv[2])
    book_file = BOOK_DIR / f"{book_id}.json"
    if not book_file.exists():
        print(f"no such book file: {book_file}", file=sys.stderr)
        sys.exit(1)

    changes = json.loads(changes_path.read_text(encoding="utf-8"))
    data = json.loads(book_file.read_text(encoding="utf-8"))

    applied = 0
    missing = []
    for key, new_text in changes.items():
        c_str, v_str = key.split(":")
        ci, vi = int(c_str) - 1, int(v_str) - 1
        if ci < 0 or ci >= len(data["chapters"]) or vi < 0 or vi >= len(data["chapters"][ci]):
            missing.append(key)
            continue
        verse = data["chapters"][ci][vi]
        if verse["n"] != int(v_str):
            missing.append(key)
            continue
        verse["t"] = new_text
        applied += 1

    if missing:
        print(f"WARNING: {len(missing)} keys did not resolve to a real verse: {missing}", file=sys.stderr)

    book_file.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"{book_id}: applied {applied} verse changes")


if __name__ == "__main__":
    main()
