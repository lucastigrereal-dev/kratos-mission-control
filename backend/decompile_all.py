"""Decompile all .pyc files from backend and write to corresponding .py paths."""
from pathlib import Path
from decompyle3.main import decompile_file

backend = Path(r"C:\Users\lucas\kratos-mission-control\backend\app")

# Process all .pyc files in __pycache__ directories
for pyc_path in backend.rglob("__pycache__/*.cpython-312.pyc"):
    # Determine target .py path
    module_name = pyc_path.stem.split(".")[0]  # e.g. "tasks"
    parent_dir = pyc_path.parent.parent  # e.g. routes/
    target_py = parent_dir / f"{module_name}.py"

    if target_py.exists():
        print(f"SKIP (exists): {target_py}")
        continue

    print(f"Decompiling: {pyc_path} -> {target_py}")
    try:
        source = decompile_file(str(pyc_path))
        if source:
            target_py.write_text(source, encoding="utf-8")
            print(f"  OK: {len(source)} chars")
        else:
            print(f"  FAILED: empty output")
    except Exception as e:
        print(f"  ERROR: {e}")
