#!/usr/bin/env python3
"""
Generates the Simplified Chinese "DeepSeek explanation" content for
Inkverse using DeepSeek's API. Only needs Python 3 (built into macOS;
on Windows install from python.org if `python3 --version` fails).

Usage (no arguments needed for the Genesis 1-3 pilot):
    python3 generate_deepseek_explain.py

To generate a different book/chapter range later:
    python3 generate_deepseek_explain.py <book_id> <start_chapter> <end_chapter>
    e.g. python3 generate_deepseek_explain.py exo 1 10

Your API key is asked for at runtime (not stored in this file). Output is
saved to a JSON file in the current folder AND printed to the screen —
send that file (or paste its contents) back to Claude to add to the app.
"""

import json
import sys
import time
import urllib.request
import urllib.error
import getpass

# id -> (Simplified Chinese book name, total chapter count)
BOOKS = {
    "gen": ("创世记", 50), "exo": ("出埃及记", 40), "lev": ("利未记", 27), "num": ("民数记", 36),
    "deu": ("申命记", 34), "jos": ("约书亚记", 24), "jdg": ("士师记", 21), "rut": ("路得记", 4),
    "1sa": ("撒母耳记上", 31), "2sa": ("撒母耳记下", 24), "1ki": ("列王纪上", 22), "2ki": ("列王纪下", 25),
    "1ch": ("历代志上", 29), "2ch": ("历代志下", 36), "ezr": ("以斯拉记", 10), "neh": ("尼希米记", 13),
    "est": ("以斯帖记", 10), "job": ("约伯记", 42), "psa": ("诗篇", 150), "pro": ("箴言", 31),
    "ecc": ("传道书", 12), "sos": ("雅歌", 8), "isa": ("以赛亚书", 66), "jer": ("耶利米书", 52),
    "lam": ("耶利米哀歌", 5), "eze": ("以西结书", 48), "dan": ("但以理书", 12), "hos": ("何西阿书", 14),
    "joe": ("约珥书", 3), "amo": ("阿摩司书", 9), "oba": ("俄巴底亚书", 1), "jon": ("约拿书", 4),
    "mic": ("弥迦书", 7), "nah": ("那鸿书", 3), "hab": ("哈巴谷书", 3), "zep": ("西番雅书", 3),
    "hag": ("哈该书", 2), "zec": ("撒迦利亚书", 14), "mal": ("玛拉基书", 4), "mat": ("马太福音", 28),
    "mar": ("马可福音", 16), "luk": ("路加福音", 24), "joh": ("约翰福音", 21), "act": ("使徒行传", 28),
    "rom": ("罗马书", 16), "1co": ("哥林多前书", 16), "2co": ("哥林多后书", 13), "gal": ("加拉太书", 6),
    "eph": ("以弗所书", 6), "phi": ("腓立比书", 4), "col": ("歌罗西书", 4), "1th": ("帖撒罗尼迦前书", 5),
    "2th": ("帖撒罗尼迦后书", 3), "1ti": ("提摩太前书", 6), "2ti": ("提摩太后书", 4), "tit": ("提多书", 3),
    "phm": ("腓利门书", 1), "heb": ("希伯来书", 13), "jas": ("雅各书", 5), "1pe": ("彼得前书", 5),
    "2pe": ("彼得后书", 3), "1jo": ("约翰一书", 5), "2jo": ("约翰二书", 1), "3jo": ("约翰三书", 1),
    "jud": ("犹大书", 1), "rev": ("启示录", 22),
}

API_URL = "https://api.deepseek.com/v1/chat/completions"

SYSTEM_PROMPT = (
    "你是一位圣经研经助手，为中文读者撰写简体中文的圣经洞见内容。"
    "风格平实、准确、避免宗派争议，像一篇简短的灵修注解，语言清晰易懂，"
    "适合普通读者（包括长者）阅读。请仅以JSON格式回复，不要包含任何其他文字、"
    "不要使用markdown代码块标记。"
)

def build_user_prompt(book_name, chapter):
    return f"""请为《{book_name}》第{chapter}章撰写解经内容（依据和合本经文）。
以严格的JSON对象回复，结构如下，且必须使用简体中文：
{{
  "summary": "一句话概括本章内容",
  "keyPoints": ["要点一", "要点二", "要点三"],
  "keyVerses": ["{chapter}:1", "{chapter}:5-6"],
  "themes": ["主题一", "主题二", "主题三"],
  "application": "一段应用于日常生活的反思或鼓励（30到60字）"
}}
要求：keyPoints恰好3项，每项15到40字左右；keyVerses为2到3个本章内的经文引用；
themes为2到3个简短主题词；summary为一句完整的话。"""


def call_deepseek(api_key, book_name, chapter, attempt=1):
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(book_name, chapter)},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.6,
        "max_tokens": 800,
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        for key in ("summary", "keyPoints", "keyVerses", "themes", "application"):
            if key not in parsed:
                raise ValueError(f"missing key '{key}' in response")
        return parsed
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        if e.code == 401:
            print("\nERROR: DeepSeek says this API key is invalid. Double-check it and try again.")
            sys.exit(1)
        if e.code == 402:
            print("\nERROR: DeepSeek says your account balance is insufficient. Top up at platform.deepseek.com and try again.")
            sys.exit(1)
        if e.code == 429 and attempt <= 4:
            wait = 5 * attempt
            print(f"  rate limited, waiting {wait}s and retrying...")
            time.sleep(wait)
            return call_deepseek(api_key, book_name, chapter, attempt + 1)
        if attempt <= 3:
            print(f"  HTTP {e.code} error, retrying ({attempt}/3)... {body[:200]}")
            time.sleep(3 * attempt)
            return call_deepseek(api_key, book_name, chapter, attempt + 1)
        print(f"\nERROR: gave up after retries. Last error: HTTP {e.code} {body[:300]}")
        sys.exit(1)
    except Exception as e:
        if attempt <= 3:
            print(f"  error ({e}), retrying ({attempt}/3)...")
            time.sleep(3 * attempt)
            return call_deepseek(api_key, book_name, chapter, attempt + 1)
        print(f"\nERROR: gave up after retries. Last error: {e}")
        sys.exit(1)


def main():
    args = sys.argv[1:]
    book_id = args[0] if len(args) > 0 else "gen"
    start_ch = int(args[1]) if len(args) > 1 else 1
    end_ch = int(args[2]) if len(args) > 2 else 3

    if book_id not in BOOKS:
        print(f"Unknown book id '{book_id}'. Valid ids: {', '.join(BOOKS.keys())}")
        sys.exit(1)
    book_name, total_chapters = BOOKS[book_id]
    end_ch = min(end_ch, total_chapters)

    print(f"Generating {book_name} ({book_id}) chapters {start_ch}-{end_ch} of {total_chapters} total...")
    api_key = getpass.getpass("Paste your DeepSeek API key (input hidden) and press Enter: ").strip()
    if not api_key:
        print("No key entered, stopping.")
        sys.exit(1)

    chapters = [None] * total_chapters
    for ch in range(start_ch, end_ch + 1):
        print(f"  chapter {ch}/{end_ch}...", end=" ", flush=True)
        result = call_deepseek(api_key, book_name, ch)
        chapters[ch - 1] = result
        print("done")

    output = {"id": book_id, "chapters": chapters}
    out_path = f"{book_id}_explain_zhhans.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {out_path} in this folder.")
    print("Send that file (or paste its contents) back to Claude to add to the app.\n")
    print("--- preview of chapter", start_ch, "---")
    print(json.dumps(chapters[start_ch - 1], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
