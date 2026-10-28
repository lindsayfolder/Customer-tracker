#!/usr/bin/env python3
"""Derive Traditional Chinese character-bio files from the Simplified
Chinese ones via OpenCC (s2tw), same approach and POST_FIXES as
scripts/explain-zhhant-convert.py — see that file for why s2tw (not
s2twp) and why these specific corrections exist.

Usage: python3 scripts/characters-zhhant-convert.py [character_id ...]
  With no args, converts every public/characters/zh-hans/*.json that exists.
"""
import json
import sys
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "characters" / "zh-hans"
DST = ROOT / "public" / "characters" / "zh-hant"

converter = opencc.OpenCC("s2tw")

POST_FIXES = {
    "併為": "並為",
    "併非": "並非",
    "併在": "並在",
    "併於": "並於",
    "併將": "並將",
    "併應": "並應",
    "併設": "並設",
    "併賜": "並賜",
    "併除": "並除",
    "併成": "並成",
    "併吞滅": "並吞滅",
    "併差": "並差",
    "地面幹了": "地面乾了",
    "幹了": "乾了",
    "儘性": "盡性",
    "孃家": "娘家",  # OpenCC occasionally over-corrects 娘 to the archaic 孃 in this compound; the CUV scripture text itself uses 娘家 (see Ruth 1:8), so that's the standard this app follows
    "亞幹": "亞干",  # Achan's name is a transliteration (just the character 干, not "dry/do"); OpenCC's 幹/乾 heuristic misfires on it, but the CUV scripture text itself uses 亞干 (see Joshua 7:1)
    "以比贊": "以比讚",  # Ibzan's name is a transliteration; OpenCC converts 赞 to the wrong of two valid traditional variants, but the CUV scripture text itself uses 以比讚 (see Judges 12:8)
}


def apply_post_fixes(s: str) -> str:
    for wrong, right in POST_FIXES.items():
        s = s.replace(wrong, right)
    return s


def convert_value(v):
    if isinstance(v, str):
        return apply_post_fixes(converter.convert(v))
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
        dst_file.write_text(
            json.dumps(converted, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"{src_file.name} -> zh-hant")


if __name__ == "__main__":
    main()
