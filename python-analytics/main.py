import argparse
import logging
import os
from datetime import datetime
from src.core.parser import parse_timeline_json
from src.core.filters import filter_by_date
from src.core.distance import summarize_day
from src.core.animated_map_generator import generate_animated_map
from src.core.proximity_analyzer import find_proximity_matches
from src.core.shared_map_generator import generate_shared_map
from src.core.relationship_scorer import calculate_relationship_insight
from src.utils.json_exporter import export_json
from src.utils.loader import load_and_validate_json

def setup_logging():
    os.makedirs("logs", exist_ok=True)
    log_path = f"logs/wandersync_{datetime.now().strftime('%Y-%m-%d')}.log"
    logging.basicConfig(
        filename=log_path,
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    return log_path

def parse_args():
    parser = argparse.ArgumentParser(description="WanderSync Proximity Analyzer")
    parser.add_argument("--person-a", required=True, help="Path to Person A's timeline JSON")
    parser.add_argument("--person-b", required=True, help="Path to Person B's timeline JSON")
    parser.add_argument("--date", help="Date to analyze (YYYY-MM-DD), default is today")
    parser.add_argument("--name-a", help="Name of Person A", default="Person A")
    parser.add_argument("--name-b", help="Name of Person B", default="Person B")
    return parser.parse_args()

def main():
    args = parse_args()
    selected_date = args.date or datetime.now().strftime("%Y-%m-%d")
    name_a = args.name_a
    name_b = args.name_b

    setup_logging()
    logging.info(f"Running analysis for {name_a} and {name_b} on {selected_date}")

    # Load and validate
    timeline_a = load_and_validate_json(args.person_a)
    timeline_b = load_and_validate_json(args.person_b)

    # Parse and filter
    points_a = filter_by_date(parse_timeline_json(timeline_a), selected_date)
    points_b = filter_by_date(parse_timeline_json(timeline_b), selected_date)

    if not points_a or not points_b:
        print("⚠️ Not enough data to proceed for selected date.")
        logging.warning("Missing data for one or both users.")
        return

    # Distance summary
    summary_a = summarize_day(points_a)
    summary_b = summarize_day(points_b)

    # Encounters
    encounters = find_proximity_matches(points_a, points_b)
    if encounters:
        print(f"\n🧲 Found {len(encounters)} close encounter(s):")
        for e in encounters:
            print(f" - {name_a} @ {e['person_a_time']} ↔ {name_b} @ {e['person_b_time']} = {e['distance_m']:.2f} meters")

    # Maps
    generate_shared_map(points_a, points_b, encounters, output_path=f"output/maps/shared_{selected_date}.html")
    generate_animated_map(points_a, points_b, output_path=f"output/maps/animated_{selected_date}.html")

    # Exports
    export_json(summary_a, f"output/stats/stats_{name_a.lower().replace(' ', '_')}_{selected_date}.json")
    export_json(summary_b, f"output/stats/stats_{name_b.lower().replace(' ', '_')}_{selected_date}.json")
    export_json(encounters, f"output/stats/proximity_{selected_date}.json")

    # Insight score
    insight = calculate_relationship_insight(encounters)
    score = insight["score"]
    details = insight["details"]
    summary = insight["summary"]

    print(f"\n💞 Relationship Insight Score: {score:.2f}/100")
    print(f"🔎 Details: {details}")
    print(f"📖 Summary: {summary}")
    export_json(
        {
            "score": score,
            "details": details,
            "summary": summary,
            "names": {"a": name_a, "b": name_b},
            "date": selected_date
        },
        f"output/stats/insight_{selected_date}.json"
    )

if __name__ == "__main__":
    main()
