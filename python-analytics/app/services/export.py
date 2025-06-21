import json
import os
from typing import Any

def export_json(data: Any, output_path: str, label: str = "File", log: bool = True):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    if log:
        print(f"\n📤 {label} exported to {output_path}")
