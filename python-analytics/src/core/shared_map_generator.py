import folium
from typing import List, Dict
import os

def generate_shared_map(person_a: List[Dict], person_b: List[Dict], matches: List[Dict], output_path: str):
    if not person_a or not person_b:
        print("Missing data for one or both persons.")
        return

    # Center map on first point from A
    m = folium.Map(location=(person_a[0]['latitude'], person_a[0]['longitude']), zoom_start=15)

    # Draw person A path
    folium.PolyLine(
        [(p['latitude'], p['longitude']) for p in person_a],
        color='red', weight=2.5, opacity=0.8,
        tooltip="Person A route"
    ).add_to(m)

    # Draw person B path
    folium.PolyLine(
        [(p['latitude'], p['longitude']) for p in person_b],
        color='blue', weight=2.5, opacity=0.8,
        tooltip="Person B route"
    ).add_to(m)

    # Mark proximity matches
    for match in matches:
        lat, lon = None, None
        for p in person_a:
            if p['timestamp'].isoformat() == match['person_a_time']:
                lat = p['latitude']
                lon = p['longitude']
                break
        if lat:
            folium.Marker(
                location=(lat, lon),
                popup=f"{match['distance_m']}m\nA: {match['person_a_time']}\nB: {match['person_b_time']}",
                icon=folium.Icon(color='green', icon='users')
            ).add_to(m)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    m.save(output_path)
    print(f"\n🗺️  Shared proximity map saved to {output_path}")
