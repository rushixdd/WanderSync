from datetime import timedelta
from typing import List, Dict
from src.core.distance import haversine

def find_proximity_matches(person_a: List[Dict], person_b: List[Dict], max_minutes_diff=5, max_distance_m=50) -> List[Dict]:
    """
    Match each point from person A to the closest point in person B within time and distance thresholds.
    Returns list of matches with timestamps and distance in meters.
    """
    matches = []
    time_delta = timedelta(minutes=max_minutes_diff)

    for a_point in person_a:
        closest_match = None
        smallest_distance = float("inf")

        for b_point in person_b:
            time_diff = abs(a_point["timestamp"] - b_point["timestamp"])
            if time_diff > time_delta:
                continue

            distance_km = haversine(
                a_point["latitude"], a_point["longitude"],
                b_point["latitude"], b_point["longitude"]
            )
            distance_m = distance_km * 1000

            if distance_m < max_distance_m and distance_m < smallest_distance:
                closest_match = b_point
                smallest_distance = distance_m

        if closest_match:
            matches.append({
                "person_a_time": a_point["timestamp"].isoformat(),
                "person_b_time": closest_match["timestamp"].isoformat(),
                "distance_m": round(smallest_distance, 2)
            })


    return matches
