import json
from datetime import datetime
import re
from typing import List, Dict


def parse_point_string(point: str) -> Dict[str, float]:
    """Convert '21.1291318°, 79.0608202°' to float lat/lng"""
    # Remove non-numeric and non-comma/period characters
    clean = point.replace("Â", "").replace("°", "").strip()
    lat_str, lng_str = clean.split(",")
    return {"latitude": float(lat_str), "longitude": float(lng_str)}



def parse_timeline_json(data: Dict) -> List[Dict]:
    """Extract structured data from timeline JSON"""
    results = []
    segments = data.get("semanticSegments", [])

    for segment in segments:
        timeline_path = segment.get("timelinePath", [])
        for point in timeline_path:
            coords = parse_point_string(point["point"])
            time_str = point["time"]
            timestamp = datetime.fromisoformat(time_str.replace("Z", ""))

            results.append({
                "timestamp": timestamp,
                "latitude": coords["latitude"],
                "longitude": coords["longitude"]
            })

        # Optionally extract visit points
        visit = segment.get("visit", {}).get("topCandidate", {})
        lat_lng = visit.get("placeLocation", {}).get("latLng")
        if lat_lng:
            coords = parse_point_string(lat_lng)
            start = segment.get("startTime")
            end = segment.get("endTime")
            if start and end:
                results.append({
                    "timestamp": datetime.fromisoformat(start.replace("Z", "")),
                    "latitude": coords["latitude"],
                    "longitude": coords["longitude"],
                    "type": "visit"
                })

    return results
