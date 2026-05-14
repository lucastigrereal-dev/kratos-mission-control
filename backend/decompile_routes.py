import marshal, dis
from pathlib import Path

route_dir = Path(r"C:\Users\lucas\kratos-mission-control\backend\app\routes\__pycache__")

for pyc_file in sorted(route_dir.glob("*.pyc")):
    name = pyc_file.stem  # e.g. "tasks.cpython-312"
    module_name = name.split(".")[0]  # e.g. "tasks"

    with open(pyc_file, "rb") as f:
        f.read(4)  # magic
        flags = int.from_bytes(f.read(4), 'little')
        f.read(4)  # timestamp
        f.read(4)  # size
        code = marshal.load(f)

    # Print function names (route handlers)
    func_codes = [c for c in code.co_consts if hasattr(c, "co_name")]

    print(f"\n=== {module_name} ===")
    print(f"Imports names: {code.co_names[:20]}")
    print(f"Functions: {[(c.co_name, c.co_varnames) for c in func_codes]}")

    # Print string constants that look like paths
    for c in code.co_consts:
        if isinstance(c, str) and c.startswith("/"):
            print(f"  Path: {c}")

    # Print first 30 bytecode instructions
    for inst in dis.get_instructions(code)[:50]:
        print(f"  {inst.offset:4d} {inst.opname:30s} {inst.argrepr}")
