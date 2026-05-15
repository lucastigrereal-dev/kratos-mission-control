import marshal, dis

pyc_path = r"C:\Users\lucas\kratos-mission-control\backend\app\db\__pycache__\__init__.cpython-312.pyc"
with open(pyc_path, "rb") as f:
    magic = f.read(4)
    f.read(4)  # flags
    f.read(4)  # timestamp
    f.read(4)  # size
    code = marshal.load(f)

for c in code.co_consts:
    if hasattr(c, "co_name") and c.co_name in ("get_db", "init_db", "seed_db", "now_iso", "generate_id"):
        print(f"\n=== {c.co_name} ===")
        print(f"Varnames: {c.co_varnames}")
        print(f"Names: {c.co_names}")
        simple_consts = [x for x in c.co_consts if not hasattr(x, "co_name")]
        print(f"Constants: {simple_consts}")
        for inst in dis.get_instructions(c):
            print(f"  {inst.offset:4d} {inst.opname:30s} {inst.argrepr}")
