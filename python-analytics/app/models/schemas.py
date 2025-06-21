from pydantic import BaseModel
from typing import List

class LocationPoint(BaseModel):
    timestamp: str
    latitude: float
    longitude: float

class AnalyzeRequest(BaseModel):
    person_a: List[LocationPoint]
    person_b: List[LocationPoint]
    date: str
    name_a: str
    name_b: str
    export: bool = False

class AnalyzeResponse(BaseModel):
    score: float
    summary: str
    details: dict
