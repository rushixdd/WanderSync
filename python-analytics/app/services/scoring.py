from typing import List, Dict
import statistics

def calculate_relationship_insight(moments: List[Dict]) -> Dict:
    if not moments:
        return {
            "connection_score": 0,
            "title": "Separate Journeys",
            "narrative": "No significant moments of proximity were found on this day."
        }

    num_moments = len(moments)
    total_duration_seconds = sum(m["duration_seconds"] for m in moments)
    avg_min_distance = statistics.mean(m["min_distance_meters"] for m in moments)
    total_duration_minutes = total_duration_seconds / 60

    # Scoring Logic
    proximity_score = max(0, 100 - (avg_min_distance * 2))
    duration_score = min(100, (total_duration_minutes / 180) * 100)
    moments_score = min(100, num_moments * 20)

    # Final Weighted Score
    final_score = round((proximity_score * 0.4) + (duration_score * 0.4) + (moments_score * 0.2), 2)
    
    # Narrative Generation
    if final_score > 80:
        title = "A Day of Strong Connection"
    elif final_score > 50:
        title = "A Day of Crossing Paths"
    else:
        title = "Two Largely Separate Journeys"
        
    narrative = f"You shared {num_moments} key moment(s) for a total of {round(total_duration_minutes)} minutes."

    return {
        "connection_score": final_score,
        "title": title,
        "narrative": narrative
    }