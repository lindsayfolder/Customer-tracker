#!/usr/bin/env python3
"""Regenerate public/bible/zh-hans/*.json from public/bible/zh-hant/*.json via
OpenCC (t2s) -- zh-hant is the scripture text's source of truth. Mirrors
scripts/zh-hans-convert.py (which does the same for public/insights), but
uses the exact same compact-JSON serialization as the existing bible files
(ensure_ascii=False, separators=(",", ":"), no indent) so diffs stay clean.

Usage: python3 scripts/bible-zhhans-convert.py [book_id ...]
  With no args, converts every public/bible/zh-hant/*.json.
"""
import json
import sys
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "bible" / "zh-hant"
DST = ROOT / "public" / "bible" / "zh-hans"

converter = opencc.OpenCC("t2s")


def convert_value(v):
    if isinstance(v, str):
        return converter.convert(v)
    if isinstance(v, list):
        return [convert_value(x) for x in v]
    if isinstance(v, dict):
        return {k: convert_value(x) for k, x in v.items()}
    return v


def main():
    ids = sys.argv[1:]
    files = [SRC / f"{i}.json" for i in ids] if ids else sorted(SRC.glob("*.json"))
    for src_file in files:
        if not src_file.exists():
            print(f"skip (missing): {src_file.name}")
            continue
        data = json.loads(src_file.read_text(encoding="utf-8"))
        converted = convert_value(data)
        dst_file = DST / src_file.name
        dst_file.write_text(
            json.dumps(converted, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
        )
        print(f"{src_file.name} -> zh-hans")


if __name__ == "__main__":
    main()
