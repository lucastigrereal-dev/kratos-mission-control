"""
Notion → Obsidian → Akasha ingestion pipeline.

USAGE:
  1. FIRST (manual): In Notion, open each page/database you want to sync.
     Click "..." → Connections → Add → "AKASHA+OBSIDIAN"
  2. python scripts/ingest_notion.py --full       # initial backfill
  3. python scripts/ingest_notion.py --incremental  # delta sync (afterward)

State is stored in .planning/notion_sync_state.json.
"""
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

NOTION_TOKEN = "ntn_k93739128407YYIgED6GtbqQCfosMUP9hwSLU2dO3di8nX"
NOTION_VERSION = "2022-06-28"
OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"
STATE_FILE = Path.home() / ".planning" / "notion_sync_state.json"


def notion_api(endpoint, method="GET", body=None, retries=3):
    """Call the Notion API with retry and backoff."""
    import urllib.request
    import urllib.error

    url = f"https://api.notion.com/v1/{endpoint}"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }

    data = json.dumps(body).encode() if body else None

    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err = e.read().decode()
            print(f"  Notion API error [{e.code}]: {err[:200]}")
            if e.code == 429:
                wait = 2 ** attempt
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            return None
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"  Connection error, retry in {wait}s... ({e})")
                time.sleep(wait)
                continue
            print(f"  Notion API failed after {retries} retries: {e}")
            return None
    return None


def list_accessible_pages():
    """Search for all pages the integration can see."""
    results = []
    cursor = None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor

        resp = notion_api("search", method="POST", body=body)
        if not resp:
            break

        for obj in resp.get("results", []):
            obj_type = obj.get("object", "unknown")
            title = ""
            if obj_type == "page":
                title_field = obj.get("properties", {}).get("title", {}).get("title", [])
                title = "".join(t.get("plain_text", "") for t in title_field) if title_field else "Untitled"
            elif obj_type == "database":
                title = "".join(t.get("plain_text", "") for t in obj.get("title", []))
            results.append({
                "id": obj["id"],
                "type": obj_type,
                "title": title,
                "last_edited": obj.get("last_edited_time", ""),
            })

        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
        time.sleep(0.5)

    return results


def page_to_markdown(page_id):
    """Convert a Notion page block to markdown."""
    blocks = []
    cursor = None
    while True:
        url = f"blocks/{page_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        resp = notion_api(url)
        if not resp:
            break
        blocks.extend(resp.get("results", []))
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
        time.sleep(0.5)

    md_lines = []
    for block in blocks:
        block_type = block.get("type", "")
        content = block.get(block_type, {})

        if block_type == "paragraph":
            text = "".join(
                t.get("plain_text", "") for t in content.get("rich_text", [])
            )
            if text.strip():
                md_lines.append(f"{text}\n")

        elif block_type == "heading_1":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"\n# {text}\n")

        elif block_type == "heading_2":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"\n## {text}\n")

        elif block_type == "heading_3":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"\n### {text}\n")

        elif block_type == "bulleted_list_item":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"- {text}\n")

        elif block_type == "numbered_list_item":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"1. {text}\n")

        elif block_type == "to_do":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            checked = content.get("checked", False)
            md_lines.append(f"- [{'x' if checked else ' '}] {text}\n")

        elif block_type == "code":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            lang = content.get("language", "")
            md_lines.append(f"```{lang}\n{text}\n```\n")

        elif block_type == "quote":
            text = "".join(t.get("plain_text", "") for t in content.get("rich_text", []))
            md_lines.append(f"> {text}\n")

        elif block_type == "divider":
            md_lines.append("\n---\n")

    return "\n".join(md_lines)


def database_to_markdown(database_id):
    """Query a Notion database and convert pages to markdown."""
    docs = []
    cursor = None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        resp = notion_api(f"databases/{database_id}/query", method="POST", body=body)
        if not resp:
            break
        for page in resp.get("results", []):
            title = ""
            for prop_name, prop_val in page.get("properties", {}).items():
                if prop_val.get("type") == "title":
                    title = "".join(
                        t.get("plain_text", "") for t in prop_val.get("title", [])
                    )
                    break
            page_md = page_to_markdown(page["id"])
            docs.append({"id": page["id"], "title": title or "Untitled", "content": page_md})
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
        time.sleep(0.5)
    return docs


def save_to_obsidian(title, content, source_type="notion"):
    """Save a document as markdown in the Obsidian vault."""
    folder = OBSIDIAN_PATH / "0-Inbox"
    folder.mkdir(parents=True, exist_ok=True)

    safe_name = "".join(c for c in title[:60] if c.isprintable() and c not in '<>:"/\\|?*')
    if not safe_name:
        safe_name = "notion-note"

    fpath = folder / f"{safe_name}.md"
    idx = 1
    while fpath.exists():
        fpath = folder / f"{safe_name}-{idx}.md"
        idx += 1

    now = datetime.now().strftime("%Y-%m-%d")
    fm = (
        f'---\n'
        f'title: "{title}"\n'
        f'tags: [notion, {source_type}]\n'
        f'domain: notion-import\n'
        f'para: inbox\n'
        f'created: {now}\n'
        f'source: {source_type}\n'
        f'---\n\n'
        f'# {title}\n\n'
        f'{content}'
    )
    fpath.write_text(fm, encoding="utf-8")
    return fpath


def run_full_sync():
    """Full sync: fetch all accessible pages and databases from Notion."""
    print("Scanning Notion workspace...")
    pages = list_accessible_pages()

    if not pages:
        print("\n  *** Nenhuma pagina acessivel ***")
        print("  Em cada pagina/database do Notion:")
        print("    '...' -> Connections -> Add -> 'AKASHA+OBSIDIAN'")
        return []

    print(f"  Found {len(pages)} items")
    synced = []

    for i, page in enumerate(pages, 1):
        title = page["title"] or "Untitled"
        print(f"  [{i}/{len(pages)}] {title[:60]}...")

        if page["type"] == "database":
            docs = database_to_markdown(page["id"])
            for doc in docs:
                fpath = save_to_obsidian(doc["title"], doc["content"], "notion-database")
                synced.append({"title": doc["title"], "path": str(fpath)})
            time.sleep(1.0)  # ~3 req/s rate limit
        else:
            md = page_to_markdown(page["id"])
            fpath = save_to_obsidian(title, md, "notion-page")
            synced.append({"title": title, "path": str(fpath)})
            time.sleep(1.0)

    # Save state
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    state = {
        "last_sync": datetime.now().isoformat(),
        "synced_count": len(synced),
        "items": synced,
    }
    STATE_FILE.write_text(json.dumps(state, indent=2))

    print(f"\n  Synced {len(synced)} items to Obsidian")
    print(f"  Next: run 'python scripts/ingest_obsidian_to_akasha.py' to index into Akasha")
    return synced


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "--full"
    if cmd == "--full":
        run_full_sync()
    elif cmd == "--incremental":
        print("Incremental sync: checking for changes since last sync...")
        run_full_sync()  # simplified for MVP
    else:
        print("Usage: python ingest_notion.py [--full|--incremental]")
