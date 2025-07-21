from datetime import timedelta, datetime
from typing import List, Dict
from .distance import haversine
import statistics

def _find_raw_proximity_matches(person_a: List[Dict], person_b: List[Dict], max_minutes_diff=15, max_distance_m=100) -> List[Dict]:
    matches = []
    time_delta = timedelta(minutes=max_minutes_diff)
    b_points_sorted = sorted(person_b, key=lambda p: p["timestamp"])

    for a_point in person_a:
        potential_matches = [p for p in b_points_sorted if abs(a_point["timestamp"] - p["timestamp"]) <= time_delta]
        if not potential_matches:
            continue

        closest_match_point = None
        smallest_distance = float("inf")

        for b_point in potential_matches:
            distance_m = haversine(a_point["latitude"], a_point["longitude"], b_point["latitude"], b_point["longitude"]) * 1000
            if distance_m < max_distance_m and distance_m < smallest_distance:
                smallest_distance = distance_m
                closest_match_point = b_point
        
        if closest_match_point:
            matches.append({"a_point": a_point, "b_point": closest_match_point, "distance_m": round(smallest_distance, 2)})
    return matches

def find_and_cluster_moments(person_a: List[Dict], person_b: List[Dict], max_minutes_between_moments=30) -> List[Dict]:
    raw_matches = _find_raw_proximity_matches(person_a, person_b)
    if not raw_matches:
        return []

    raw_matches.sort(key=lambda m: m["a_point"]["timestamp"])
    clustered_moments, current_moment = [], [raw_matches[0]]

    for i in range(1, len(raw_matches)):
        prev_match, current_match = raw_matches[i-1], raw_matches[i]
        time_diff = current_match["a_point"]["timestamp"] - prev_match["a_point"]["timestamp"]
        
        if time_diff <= timedelta(minutes=max_minutes_between_moments):
            current_moment.append(current_match)
        else:
            clustered_moments.append(current_moment)
            current_moment = [current_match]
    clustered_moments.append(current_moment)

    final_moments = []
    for moment_cluster in clustered_moments:
        start_time = moment_cluster[0]["a_point"]["timestamp"]
        end_time = moment_cluster[-1]["a_point"]["timestamp"]
        avg_lat = statistics.mean(m["a_point"]["latitude"] for m in moment_cluster)
        avg_lon = statistics.mean(m["a_point"]["longitude"] for m in moment_cluster)
        distances = [m["distance_m"] for m in moment_cluster]
        
        final_moments.append({
            "location_coords": [round(avg_lat, 6), round(avg_lon, 6)],
            "start_time_utc": start_time.isoformat(),
            "end_time_utc": end_time.isoformat(),
            "duration_seconds": (end_time - start_time).total_seconds(),
            "average_distance_meters": round(statistics.mean(distances), 2),
            "min_distance_meters": min(distances)
        })
    return final_moments