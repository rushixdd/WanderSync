# src/routers/analyze.py
from fastapi import APIRouter, UploadFile, Form, Depends, status, HTTPException
from datetime import datetime
from typing import Optional
from app.auth.security import verify_api_key
from app.utils.loader import load_and_validate_json
from app.services.parser import parse_timeline_json
from app.services.filters import filter_by_date
from app.services.distance import summarize_day
from app.services.proximity import find_proximity_matches
from app.services.scoring import calculate_relationship_insight
from app.services.maps import generate_animated_map, generate_shared_map
from app.services.export import export_json

import tempfile
import os

router = APIRouter()

@router.post("/analyze", dependencies=[Depends(verify_api_key)])
async def analyze_proximity(
    person_a_file: UploadFile,
    person_b_file: UploadFile,
    name_a: Optional[str] = Form("Person A"),
    name_b: Optional[str] = Form("Person B"),
    date: Optional[str] = Form(datetime.now().strftime("%Y-%m-%d"))
):
    # Save uploads to temp files
    tmp_a = tempfile.NamedTemporaryFile(delete=False)
    tmp_a.write(await person_a_file.read())
    tmp_a.close()

    tmp_b = tempfile.NamedTemporaryFile(delete=False)
    tmp_b.write(await person_b_file.read())
    tmp_b.close()

    # Load and process
    try:
        timeline_a = load_and_validate_json(tmp_a.name)
        timeline_b = load_and_validate_json(tmp_b.name)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid location history file: {str(e)}"
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File not found: {str(e)}"
        )


    points_a = filter_by_date(parse_timeline_json(timeline_a), date)
    points_b = filter_by_date(parse_timeline_json(timeline_b), date)

    if not points_a or not points_b:
        return {"message": "Not enough data for selected date."}

    summary_a = summarize_day(points_a)
    summary_b = summarize_day(points_b)
    matches = find_proximity_matches(points_a, points_b)
    insight = calculate_relationship_insight(matches)

    # File exports
    os.makedirs("output/api", exist_ok=True)
    export_json(summary_a, f"output/api/summary_a_{date}.json", log=False)
    export_json(summary_b, f"output/api/summary_b_{date}.json", log=False)
    export_json(matches, f"output/api/proximity_{date}.json", log=False)
    export_json(insight, f"output/api/insight_{date}.json", log=False)

    # Maps
    generate_shared_map(points_a, points_b, matches, output_path=f"output/api/shared_map_{date}.html")
    generate_animated_map(points_a, points_b, output_path=f"output/api/animated_map_{date}.html")

    # Cleanup
    os.remove(tmp_a.name)
    os.remove(tmp_b.name)

    return {
        "summary": {
            "person_a": summary_a,
            "person_b": summary_b
        },
        "encounters": matches,
        "insight": insight,
        "maps": {
            "shared_map": f"/static/api/shared_map_{date}.html",
            "animated_map": f"/static/api/animated_map_{date}.html"
        }
    }
