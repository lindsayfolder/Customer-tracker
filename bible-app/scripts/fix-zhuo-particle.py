#!/usr/bin/env python3
"""Fix Simplified Chinese content that uses the Traditional-style particle
Zhu4 (as in verb+Zhu4 continuous-action forms) instead of the correct
Simplified Zhe/particle character.

Traditional Chinese never split that character into two, so any content
that went through a naive Traditional->Simplified pass (or was authored
with Traditional habits) tends to leave the Traditional form untouched.
Standard Mainland Simplified reserves the Traditional glyph only for the
"zhu4" (notable/write) sense - the words listed in ZHU_WORDS below. Every
other use (the continuous-action particle, and zhuo2 words) should use the
Simplified glyph.

Usage: python3 scripts/fix-zhuo-particle.py <glob> [<glob> ...]
  e.g. python3 scripts/fix-zhuo-particle.py "public/bible/zh-hans/*.json" "public/insights/zh-hans/*.json"
"""
import glob
import json
import sys

TRAD_CHAR = "著"  # 著
SIMP_CHAR = "着"  # 着

ZHU_WORDS = [
    "著名",  # 著名
    "著作",  # 著作
    "显著",  # 显著
    "昭著",  # 昭著
    "卓著",  # 卓著
    "编著",  # 编著
    "论著",  # 论著
    "原著",  # 原著
    "名著",  # 名著
    "土著",  # 土著
    "著录",  # 著录
    "著称",  # 著称
    "著述",  # 著述
    "颇著",  # 颇著
    "彰著",  # 彰著
    "遗著",  # 遗著
    "巨著",  # 巨著
    "拙著",  # 拙著
    "新著",  # 新著
    "大著",  # 大著
    "力著",  # 力著
]


def placeholder(i: int) -> str:
    # Private-use-area codepoint: guaranteed not to collide with any real
    # character already present in the content (plain digits would not be
    # safe, since verse text is full of them).
    return chr(0xE000 + i)


def fix_text(text: str) -> str:
    tmp = text
    for i, w in enumerate(ZHU_WORDS):
        tmp = tmp.replace(w, placeholder(i))
    tmp = tmp.replace(TRAD_CHAR, SIMP_CHAR)
    for i, w in enumerate(ZHU_WORDS):
        tmp = tmp.replace(placeholder(i), w)
    return tmp


def main() -> None:
    patterns = sys.argv[1:]
    if not patterns:
        print(__doc__)
        sys.exit(1)

    total_files = 0
    total_chars = 0
    for pattern in patterns:
        for path in sorted(glob.glob(pattern)):
            with open(path, encoding="utf-8") as f:
                original = f.read()
            fixed = fix_text(original)
            if fixed == original:
                continue
            # Sanity check: still valid JSON, and no accidental content loss.
            json.loads(fixed)
            n = original.count(TRAD_CHAR) - fixed.count(TRAD_CHAR)
            with open(path, "w", encoding="utf-8") as f:
                f.write(fixed)
            total_files += 1
            total_chars += n
            print(f"{path}: {n} occurrences fixed")

    print(f"\n{total_files} files changed, {total_chars} total characters fixed")


if __name__ == "__main__":
    main()
