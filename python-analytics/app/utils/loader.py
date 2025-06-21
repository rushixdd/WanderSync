import json
import os
from jsonschema import validate, ValidationError
import logging

# Minimal schema to validate timeline data structure
TIMELINE_SCHEMA = {
    "type": "object",
    "properties": {
        "semanticSegments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "timelinePath": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "point": {"type": "string"},
                                "time": {"type": "string"}
                            },
                            "required": ["point", "time"]
                        }
                    },
                    "visit": {
                        "type": "object",
                        "properties": {
                            "topCandidate": {
                                "type": "object",
                                "properties": {
                                    "placeLocation": {
                                        "type": "object",
                                        "properties": {
                                            "latLng": {"type": "string"}
                                        },
                                        "required": ["latLng"]
                                    }
                                },
                                "required": ["placeLocation"]
                            }
                        }
                    }
                }
            }
        }
    },
    "required": ["semanticSegments"]
}


def load_and_validate_json(path: str) -> dict:
    if not os.path.exists(path):
        logging.error(f"File not found: {path}")
        raise FileNotFoundError(f"File not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            logging.error(f"Invalid JSON format in file {path}: {e}")
            raise ValueError(f"Invalid JSON format: {e}")

    try:
        validate(instance=data, schema=TIMELINE_SCHEMA)
    except ValidationError as e:
        logging.error(f"Schema validation failed for file {path}: {e.message}")
        raise ValueError(f"Invalid timeline structure: {e.message}")

    logging.info(f"Successfully loaded and validated {path}")
    return data
