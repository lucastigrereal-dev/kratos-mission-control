"""System collector — CPU, RAM, disk via psutil."""
import platform


def collect():
    """Collect system stats. Returns (data, source, status)."""
    try:
        import psutil
        cpu = psutil.cpu_percent(interval=0.5)
        cpu_count = psutil.cpu_count()
        cpu_freq = psutil.cpu_freq()
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage("C:\\")

        data = {
            "hostname": platform.node(),
            "cpu": {
                "percent": cpu,
                "count": cpu_count,
                "frequency_mhz": cpu_freq.current if cpu_freq else 0,
            },
            "memory": {
                "total_gb": round(mem.total / (1024 ** 3), 1),
                "used_gb": round(mem.used / (1024 ** 3), 1),
                "percent": mem.percent,
            },
            "disk": {
                "device": "C:",
                "total_gb": round(disk.total / (1024 ** 3), 1),
                "used_gb": round(disk.used / (1024 ** 3), 1),
                "free_gb": round(disk.free / (1024 ** 3), 1),
                "percent": disk.percent,
            },
            "uptime_hours": round(
                (psutil.boot_time() and (__import__("time").time() - psutil.boot_time()) / 3600)
                or 0,
                1,
            ),
            "collector": "psutil",
        }
        return data, "real", "ok"
    except Exception as e:
        return {"hostname": platform.node(), "error": str(e)}, "fallback", "error"
