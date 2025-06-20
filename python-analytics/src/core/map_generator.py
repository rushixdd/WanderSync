import folium
from typing import List, Dict
import os

def generate_route_map(points: List[Dict], output_path: str):
    if not points:
        print("No points to map.")
        return

    # Center map on first point
    start_coords = (points[0]['latitude'], points[0]['longitude'])
    m = folium.Map(location=start_coords, zoom_start=16)

    # Add markers for each point
    for point in points:
        folium.CircleMarker(
            location=(point['latitude'], point['longitude']),
            radius=5,
            popup=point['timestamp'].isoformat(),
            color='blue',
            fill=True,
            fill_color='blue'
        ).add_to(m)

    # Connect the route
    path = [(p['latitude'], p['longitude']) for p in points]
    folium.PolyLine(path, color="red", weight=2.5, opacity=0.8).add_to(m)

    # Save HTML
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    m.save(output_path)
    print(f"\n🗺️  Route map saved to {output_path}")
