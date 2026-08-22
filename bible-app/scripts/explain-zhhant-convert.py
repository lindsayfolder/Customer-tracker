#!/usr/bin/env python3
"""Derive Traditional Chinese "explain" (DeepSeek-track) files from the
Simplified Chinese ones via OpenCC (s2tw — Taiwan-standard characters,
WITHOUT the "wp" phrase-vocabulary substitution layer).

IMPORTANT: this deliberately does NOT use s2twp. s2twp applies a Taiwan
regional-vocabulary dictionary on top of script conversion (e.g. 软件 ->
軟體), and it has been observed to badly misfire on ordinary prose that
happens to contain a substring matching a tech/IT term: "士师时代"
(the Judges era) became "計程車師時代" ("taxi-driver era", because "的士"
= taxi slang got matched across a word boundary), and "保存生命"
(preserve life) became "儲存生命" ("save/store data", a computing verb).
Both are same-length substitutions a character-level audit alone won't
catch. s2tw keeps the same correct Taiwan character preferences (為 not
爲, 裡 not 里, etc.) without this phrase-substitution risk.

This is the reverse direction of scripts/zh-hans-convert.py: there, the
Traditional file is the hand-sourced original and Simplified is the
mechanical derivative; here, DeepSeek's Simplified Chinese output is the
source of truth and Traditional is derived from it, so all four language
tabs say the same thing.

Simplified-to-Traditional conversion is inherently riskier than the other
direction: several Simplified characters map to more than one Traditional
character depending on meaning (Simplified merged them), so OpenCC can
occasionally pick the wrong one. The most common case in this app's prose
is 并 -> 併 (merge/combine) instead of 並 (also/and) — POST_FIXES below
patches that. Always spot-check freshly converted chapters before trusting
them for the whole Bible; this script does not catch every ambiguous case.

Usage: python3 scripts/explain-zhhant-convert.py [book_id ...]
  With no args, converts every public/explain/zh-hans/*.json that exists.
"""
import json
import sys
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "explain" / "zh-hans"
DST = ROOT / "public" / "explain" / "zh-hant"

converter = opencc.OpenCC("s2tw")

# Known-safe corrections for this content domain (devotional Bible
# commentary never discusses corporate mergers/acquisitions, so blindly
# preferring 並 over 併 is safe here even though it wouldn't be in general
# text).
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
    "地面幹了": "地面乾了",
    "幹了": "乾了",  # "X幹了" almost always means dried up (乾), not "did X" (幹), in this content
    "儘性": "盡性",  # "尽心尽性尽力" (with all heart/soul/strength) always means "to the utmost" (盡), never "as much as possible" (儘)
    "亞幹": "亞干",  # Achan (Joshua 7) is a proper name — OpenCC sometimes mistakes it for 幹 (trunk/do)
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
        filled = sum(1 for c in converted.get("chapters", []) if c is not None)
        print(f"{src_file.name} -> zh-hant ({filled} chapters filled)")


if __name__ == "__main__":
    main()
