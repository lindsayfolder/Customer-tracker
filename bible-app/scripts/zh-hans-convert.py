#!/usr/bin/env python3
"""Derive Simplified Chinese insight files from Traditional Chinese ones via
OpenCC (t2s), mirroring how the app's scripture text was converted.

Usage: python3 scripts/zh-hans-convert.py [book_id ...]
  With no args, converts every public/insights/zh-hant/*.json that has no
  matching (or an older) public/insights/zh-hans/*.json.
"""
import json
import sys
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "insights" / "zh-hant"
DST = ROOT / "public" / "insights" / "zh-hans"

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
    DST.mkdir(parents=True, exist_ok=True)
    ids = sys.argv[1:]
    files = [SRC / f"{i}.json" for i in ids] if ids else sorted(SRC.glob("*.json"))
    for src_file in files:
        if not src_file.exists():
            print(f"skip (missing): {src_file.name}")
            continue
        data = json.loads(src_file.read_text(encoding="utf-8"))
        converted = convert_value(data)
        dst_file = DST / src_file.name
        dst_file.write_text(json.dumps(converted, ensure_ascii=False, indent=0, separators=(",", ":")), encoding="utf-8")
        print(f"{src_file.name} -> zh-hans ({len(converted.get('chapters', []))} chapters)")


if __name__ == "__main__":
    main()
