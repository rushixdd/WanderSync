# src/routers/analyze.py
from fastapi import APIRouter, UploadFile, Form, Depends, status, HTTPException
from datetime import datetime
from typing import Optional
import tempfile
import os

# --- Service Imports ---
from app.auth.security import verify_api_key
from app.utils.loader import load_and_validate_json
from app.services.parser import parse_timeline_json
from app.services.filters import filter_by_date
from app.services.distance import summarize_day
from app.services.proximity import find_and_cluster_moments
from app.services.scoring import calculate_relationship_insight
from app.services.maps import generate_animated_map, generate_shared_map

router = APIRouter()

@router.post("/analyze", dependencies=[Depends(verify_api_key)])
async def analyze_proximity(
    person_a_file: UploadFile,
    person_b_file: UploadFile,
    name_a: Optional[str] = Form("Person A"),
    name_b: Optional[str] = Form("Person B"),
    date: Optional[str] = Form(datetime.now().strftime("%Y-%m-%d"))
):
    # Save uploads to temp files to be read by services
    tmp_a = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    tmp_a.write(await person_a_file.read())
    tmp_a.close()

    tmp_b = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    tmp_b.write(await person_b_file.read())
    tmp_b.close()

    try:
        # Load and process data
        timeline_a = load_and_validate_json(tmp_a.name)
        timeline_b = load_and_validate_json(tmp_b.name)

        points_a = filter_by_date(parse_timeline_json(timeline_a), date)
        points_b = filter_by_date(parse_timeline_json(timeline_b), date)

        if not points_a or not points_b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Not enough location data found for one or both users on the selected date."
            )

        # --- Core Analysis using Refactored Services ---
        summary_a = summarize_day(points_a)
        summary_b = summarize_day(points_b)
        moments = find_and_cluster_moments(points_a, points_b)
        insight = calculate_relationship_insight(moments)

        # --- Generate Maps ---
        # Note: generate_shared_map may need updates to visualize moments instead of raw matches
        shared_map_path = f"output/api/shared_map_{date}.html"
        animated_map_path = f"output/api/animated_map_{date}.html"
        
        generate_shared_map(points_a, points_b, moments, output_path=shared_map_path)
        generate_animated_map(points_a, points_b, output_path=animated_map_path)

        # --- Final Response Structure ---
        return {
            "individual_summaries": {
                "person_a": summary_a,
                "person_b": summary_b
            },
            "clustered_moments": moments,
            "insight": insight,
            "maps": {
                "shared_map": f"/static/api/shared_map_{date}.html",
                "animated_map": f"/static/api/animated_map_{date}.html"
            }
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file content or format: {str(e)}"
        )
    finally:
        # Cleanup temporary files
        os.remove(tmp_a.name)
        os.remove(tmp_b.name)