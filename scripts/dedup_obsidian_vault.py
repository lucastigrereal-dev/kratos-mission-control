"""
Deduplicate Obsidian vault — remove _copy files when originals exist.

USAGE:
  python scripts/dedup_obsidian_vault.py --dry-run    # show what would be deleted
  python scripts/dedup_obsidian_vault.py --execute     # actually delete
"""
import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"
SKIP_DIRS = {".obsidian", "_templates", ".trash", ".git"}

COPY_RE = re.compile(r"_copy(-\d+)?$")


def normalize_stem(stem):
    """Strip _copy suffixes to get the original filename stem."""
    return COPY_RE.sub("", stem)


def scan_duplicates():
    copies = []
    for md_file in OBSIDIAN_PATH.rglob("*.md"):
        path_str = str(md_file)
        if any(d in path_str for d in SKIP_DIRS):
            continue
        stem = md_file.stem
        if "_copy" not in stem.lower():
            continue
        base_stem = normalize_stem(stem)
        original = md_file.parent / f"{base_stem}.md"
        copies.append({
            "copy_path": md_file,
            "original_path": original,
            "original_exists": original.exists(),
            "size": md_file.stat().st_size if md_file.exists() else 0,
        })
    return copies


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--dry-run"
    execute = mode == "--execute"

    print("=" * 55)
    print(f"OBSIDIAN VAULT DEDUP {'(EXECUTE)' if execute else '(DRY RUN)'}")
    print("=" * 55)

    copies = scan_duplicates()
    print(f"\n  _copy files found: {len(copies)}")
    with_original = [c for c in copies if c["original_exists"]]
    without_original = [c for c in copies if not c["original_exists"]]
    print(f"  With original present: {len(with_original)}")
    print(f"  Without original:      {len(without_original)}")

    total_size = sum(c["size"] for c in copies)
    print(f"  Total space:           {total_size / 1024 / 1024:.1f} MB")

    # Show examples
    print(f"\n  Sample (first 10):")
    for c in copies[:10]:
        status = "HAS_ORIGINAL" if c["original_exists"] else "ORPHAN"
        print(f"    [{status}] {c['copy_path'].relative_to(OBSIDIAN_PATH)}")

    if not execute:
        print(f"\n  DRY RUN — no files deleted.")
        print(f"  Run with --execute to delete.")
        return

    # Delete all _copy files
    deleted, failed = 0, 0
    for c in copies:
        try:
            c["copy_path"].unlink()
            deleted += 1
        except Exception as e:
            print(f"  FAIL: {c['copy_path'].name} — {e}")
            failed += 1

    print(f"\n  Deleted: {deleted}")
    if failed:
        print(f"  Failed:  {failed}")

    # Check dirs that might now be empty
    print(f"\n  Re-scanning vault...")
    remaining = sum(1 for _ in OBSIDIAN_PATH.rglob("*.md")
                    if not any(d in str(_) for d in SKIP_DIRS))
    print(f"  Remaining .md files: {remaining:,}")
    print(f"  Removed:             {len(copies):,}")


if __name__ == "__main__":
    main()
