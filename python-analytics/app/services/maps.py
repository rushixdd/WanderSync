import folium
from folium.plugins import TimestampedGeoJson
from typing import List, Dict
import os

def generate_animated_map(person_a: List[Dict], person_b: List[Dict], output_path: str):
    if not person_a and not person_b:
        print("No data available to generate map.")
        return

    m = folium.Map(location=[person_a[0]['latitude'], person_a[0]['longitude']], zoom_start=15)

    def format_geojson(points: List[Dict], color: str, label: str):
        features = []
        for p in points:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [p['longitude'], p['latitude']]
                },
                "properties": {
                    "time": p['timestamp'].isoformat(),
                    "style": {"color": color},
                    "icon": "circle",
                    "popup": f"{label}: {p['timestamp'].strftime('%H:%M:%S')}"
                }
            })
        return features

    all_features = format_geojson(person_a, "red", "Person A") + format_geojson(person_b, "blue", "Person B")

    TimestampedGeoJson({
        "type": "FeatureCollection",
        "features": all_features
    },
        period="PT1M",
        add_last_point=True,
        transition_time=200,
        auto_play=False,
        loop=False
    ).add_to(m)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    m.save(output_path)
    print(f"\n🎞️  Animated map saved to {output_path}")

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
