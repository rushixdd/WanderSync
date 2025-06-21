from typing import List, Dict
from math import radians, cos, sin, asin, sqrt

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance in kilometers between two points"""
    R = 6371  # Earth radius in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c


def calculate_total_distance(points: List[Dict]) -> float:
    """Calculate total distance between ordered list of GPS points"""
    total = 0.0
    for i in range(1, len(points)):
        p1 = points[i - 1]
        p2 = points[i]
        dist = haversine(p1["latitude"], p1["longitude"], p2["latitude"], p2["longitude"])
        total += dist
    return round(total, 2)


def summarize_day(points: List[Dict]) -> Dict:
    """Generate a summary of the day's movement"""
    if not points:
        return {"total_distance_km": 0, "start_time": None, "end_time": None}

    distance = calculate_total_distance(points)
    start_time = points[0]["timestamp"]
    end_time = points[-1]["timestamp"]

    return {
        "total_distance_km": distance,
        "number_of_points": len(points),
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
    }