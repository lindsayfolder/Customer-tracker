#!/usr/bin/env python3
"""Safety net for the 他->祂 pass: for each book, confirm that reverting every
祂 back to 他 in the current file exactly reconstructs the PRE-PASS baseline
version (not necessarily HEAD -- HEAD moves forward as WIP checkpoints get
committed mid-pass, so diffing against a fixed baseline commit is what
actually catches unintended changes; diffing against a moving HEAD would
false-positive "mismatch" on every book already checkpointed in).
If that holds, the only thing that changed is the intended substitution --
no verse was dropped, reworded, reformatted, or otherwise touched.

Usage: python3 scripts/verify_he_fix.py <book_id> [book_id ...]
       python3 scripts/verify_he_fix.py --baseline <commit> <book_id> [book_id ...]
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOK_DIR = ROOT / "public" / "bible" / "zh-hant"

# The commit that added apply_he_fix.py/verify_he_fix.py themselves, i.e. the
# last commit before any book content was touched by this pass. Every book's
# true "before" state lives here regardless of how many WIP checkpoints have
# landed on top of it since.
DEFAULT_BASELINE = "7489d93"


def _git_root() -> Path:
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"], cwd=ROOT, capture_output=True, text=True, check=True
    )
    return Path(result.stdout.strip())


GIT_ROOT = _git_root()


def git_baseline_content(book_file: Path, baseline: str) -> str | None:
    rel_to_git_root = book_file.resolve().relative_to(GIT_ROOT).as_posix()
    result = subprocess.run(
        ["git", "show", f"{baseline}:{rel_to_git_root}"], cwd=GIT_ROOT, capture_output=True, text=True
    )
    if result.returncode != 0:
        return None
    return result.stdout


def main():
    args = sys.argv[1:]
    baseline = DEFAULT_BASELINE
    if args[:1] == ["--baseline"]:
        baseline = args[1]
        args = args[2:]
    book_ids = args
    if not book_ids:
        print("usage: verify_he_fix.py [--baseline <commit>] <book_id> [book_id ...]", file=sys.stderr)
        sys.exit(1)

    all_ok = True
    for book_id in book_ids:
        rel = f"public/bible/zh-hant/{book_id}.json"
        book_file = BOOK_DIR / f"{book_id}.json"
        if not book_file.exists():
            print(f"{book_id}: MISSING FILE")
            all_ok = False
            continue
        new_text = book_file.read_text(encoding="utf-8")
        old_text = git_baseline_content(book_file, baseline)
        if old_text is None:
            print(f"{book_id}: no baseline version to diff against - skipping revert check")
            continue

        # Structural sanity: valid JSON, same chapter/verse counts and numbers.
        try:
            new_data = json.loads(new_text)
            old_data = json.loads(old_text)
        except json.JSONDecodeError as e:
            print(f"{book_id}: INVALID JSON - {e}")
            all_ok = False
            continue

        if len(new_data["chapters"]) != len(old_data["chapters"]):
            print(f"{book_id}: CHAPTER COUNT MISMATCH old={len(old_data['chapters'])} new={len(new_data['chapters'])}")
            all_ok = False
            continue
        count_mismatch = False
        for ci, (oc, nc) in enumerate(zip(old_data["chapters"], new_data["chapters"])):
            if len(oc) != len(nc):
                print(f"{book_id} ch{ci+1}: VERSE COUNT MISMATCH old={len(oc)} new={len(nc)}")
                count_mismatch = True
                continue
            for ov, nv in zip(oc, nc):
                if ov["n"] != nv["n"]:
                    print(f"{book_id} ch{ci+1}: VERSE NUMBER MISMATCH old={ov['n']} new={nv['n']}")
                    count_mismatch = True
        if count_mismatch:
            all_ok = False
            continue

        reverted = new_text.replace("祂", "他")
        changed_chars = new_text.count("祂")
        if reverted == old_text:
            print(f"{book_id}: OK - {changed_chars} occurrences of 他 changed to 祂, nothing else differs")
        else:
            print(f"{book_id}: MISMATCH after reverting 祂->他 - something beyond the pronoun changed!")
            all_ok = False

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
