from typing import List, Dict
from datetime import datetime

def calculate_relationship_insight(matches: List[Dict]) -> Dict:
    if not matches:
        return {
            "score": 0,
            "summary": "No encounters detected."
        }

    total_distance = 0
    time_differences = []
    for m in matches:
        total_distance += m["distance_m"]
        t_diff = abs(
            (datetime.fromisoformat(m["person_a_time"]) - datetime.fromisoformat(m["person_b_time"])).total_seconds()
        )
        time_differences.append(t_diff)

    avg_distance = total_distance / len(matches)
    avg_time_diff = sum(time_differences) / len(matches)

    # Example scoring logic
    proximity_score = max(0, 100 - avg_distance)              # closer avg = higher score
    timing_score = max(0, 100 - (avg_time_diff / 60))         # closer in time = higher score
    encounter_score = min(100, len(matches) * 10)             # more encounters = better

    final_score = round((proximity_score * 0.4 + timing_score * 0.3 + encounter_score * 0.3), 2)

    return {
        "score": final_score,
        "details": {
            "avg_distance_m": round(avg_distance, 2),
            "avg_time_difference_sec": round(avg_time_diff, 2),
            "encounter_count": len(matches)
        },
        "summary": "Higher scores suggest stronger proximity alignment on the selected day."
    }
