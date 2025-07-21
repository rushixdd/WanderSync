# app/services/maps.py
import folium
from folium.plugins import TimestampedGeoJson
from typing import List, Dict
import os
from datetime import datetime, timedelta

# generate_animated_map function does not need changes
def generate_animated_map(person_a: List[Dict], person_b: List[Dict], output_path: str):
    if not person_a and not person_b:
        print("No data available to generate animated map.")
        return

    # To prevent errors if one list is empty
    start_location = person_a[0] if person_a else person_b[0]
    m = folium.Map(location=[start_location['latitude'], start_location['longitude']], zoom_start=15)

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

    if not all_features:
        print("No features to add to animated map.")
        m.save(output_path)
        return

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

# --- THIS FUNCTION IS NOW UPDATED ---
def generate_shared_map(person_a: List[Dict], person_b: List[Dict], moments: List[Dict], output_path: str):
    if not person_a and not person_b:
        print("Missing data for one or both persons.")
        return

    # Center map on first point from A or B
    start_location = person_a[0] if person_a else person_b[0]
    m = folium.Map(location=(start_location['latitude'], start_location['longitude']), zoom_start=15)

    # Draw person A path
    if person_a:
        folium.PolyLine(
            [(p['latitude'], p['longitude']) for p in person_a],
            color='red', weight=2.5, opacity=0.8,
            tooltip="Person A route"
        ).add_to(m)

    # Draw person B path
    if person_b:
        folium.PolyLine(
            [(p['latitude'], p['longitude']) for p in person_b],
            color='blue', weight=2.5, opacity=0.8,
            tooltip="Person B route"
        ).add_to(m)

    # --- UPDATED LOGIC: Mark clustered moments ---
    for i, moment in enumerate(moments):
        # Use the location coordinates from the moment object
        lat, lon = moment['location_coords']
        
        # Create informative popup text from the moment data
        duration_min = round(moment['duration_seconds'] / 60)
        start_time = datetime.fromisoformat(moment['start_time_utc']).strftime('%H:%M')
        
        popup_html = f"""
        <b>Moment {i+1}</b><br>
        Time: {start_time}<br>
        Duration: {duration_min} min<br>
        Avg Distance: {moment['average_distance_meters']}m
        """
        
        folium.Marker(
            location=(lat, lon),
            popup=popup_html,
            icon=folium.Icon(color='purple', icon='users', prefix='fa')
        ).add_to(m)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    m.save(output_path)
    print(f"\n🗺️  Shared proximity map saved to {output_path}")