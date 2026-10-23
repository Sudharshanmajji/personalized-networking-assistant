import json
from pathlib import Path
from threading import Lock
from typing import Any

DATABASE_DIR = Path(__file__).resolve().parent.parent / "database"
_FILE_LOCK = Lock()


def read_records(filename: str) -> list[dict[str, Any]]:
    path = DATABASE_DIR / filename

    with _FILE_LOCK:
        DATABASE_DIR.mkdir(parents=True, exist_ok=True)

        if not path.exists():
            path.write_text("[]", encoding="utf-8")

        try:
            data = json.loads(path.read_text(encoding="utf-8-sig"))
        except (json.JSONDecodeError, OSError) as exc:
            raise RuntimeError(f"Could not read {filename}: {exc}") from exc

        if not isinstance(data, list):
            raise RuntimeError(f"{filename} must contain a JSON list")

        return data


def write_records(filename: str, records: list[dict[str, Any]]) -> None:
    path = DATABASE_DIR / filename

    with _FILE_LOCK:
        DATABASE_DIR.mkdir(parents=True, exist_ok=True)
        temp_path = path.with_suffix(path.suffix + ".tmp")

        temp_path.write_text(
            json.dumps(records, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        temp_path.replace(path)