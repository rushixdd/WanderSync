from typing import List, Dict
from math import radians, cos, sin, asin, sqrt
from datetime import datetime
from collections import Counter
import statistics

# --- Haversine function (no changes) ---
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

# --- New Helper Function ---
def find_most_frequent_location(points: List[Dict], precision: int = 3) -> List[float]:
    if not points:
        return None
    # Round coordinates to create clusters
    rounded_coords = [(round(p["latitude"], precision), round(p["longitude"], precision)) for p in points]
    if not rounded_coords:
        return None
    most_common_cluster = Counter(rounded_coords).most_common(1)[0][0]
    # Get all points in that cluster
    cluster_points = [p for p in points if (round(p["latitude"], precision), round(p["longitude"], precision)) == most_common_cluster]
    # Calculate average coordinates for the cluster
    avg_lat = statistics.mean(p["latitude"] for p in cluster_points)
    avg_lon = statistics.mean(p["longitude"] for p in cluster_points)
    return [round(avg_lat, 6), round(avg_lon, 6)]

# --- Refactored Main Function ---
def summarize_day(points: List[Dict]) -> Dict:
    if not points or len(points) < 2:
        return {}
    
    # Ensure timestamps are datetime objects
    for p in points:
        if isinstance(p["timestamp"], str):
             p["timestamp"] = datetime.fromisoformat(p["timestamp"])

    total_distance = 0.0
    time_moving_seconds = 0
    start_time = points[0]["timestamp"]
    end_time = points[-1]["timestamp"]

    for i in range(1, len(points)):
        p1, p2 = points[i - 1], points[i]
        dist = haversine(p1["latitude"], p1["longitude"], p2["latitude"], p2["longitude"])
        total_distance += dist
        time_diff_seconds = (p2["timestamp"] - p1["timestamp"]).total_seconds()
        
        # Consider moving if distance > 10m to avoid GPS jitter
        if dist > 0.01 and time_diff_seconds > 0:
            time_moving_seconds += time_diff_seconds

    time_moving_minutes = round(time_moving_seconds / 60)
    avg_speed = (total_distance / (time_moving_seconds / 3600)) if time_moving_seconds > 0 else 0
    most_frequent_coords = find_most_frequent_location(points)

    return {
        "total_distance_km": round(total_distance, 2),
        "time_moving_minutes": time_moving_minutes,
        "average_speed_kmh": round(avg_speed, 2),
        "most_frequent_location_coords": most_frequent_coords,
    }