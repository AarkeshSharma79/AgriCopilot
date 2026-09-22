"""
FastAPI route definitions for the AgriMitra AI/ML service.

Endpoint naming keeps /analyze-soil and /recommend-crops consistent with
what the Node.js backend's services/aiService.js already calls, and adds
/predict-disease and /predict-yield for the newer disease- and
yield-prediction modules.
"""

from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from prediction.crop_prediction import analyze_soil_image, recommend_crops
from prediction.disease_prediction import predict_disease
from prediction.yield_prediction import predict_yield

router = APIRouter()


# ---------- Request/response schemas ----------

class RiskInput(BaseModel):
    type: str
    severity: str
    expectedDate: Optional[str] = None
    message: Optional[str] = None


class SoilPHRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None


class CandidateCropInput(BaseModel):
    name: str
    season: str
    idealSoilPH: Optional[SoilPHRange] = None
    idealSoilType: Optional[List[str]] = None
    droughtTolerant: Optional[bool] = False
    frostSensitive: Optional[bool] = False
    growthDurationDays: Optional[int] = None
    referenceYieldQtlPerAcre: Optional[float] = None


class SoilInput(BaseModel):
    ph: Optional[float] = None
    moisturePercent: Optional[float] = None
    fertilityScore: Optional[float] = None
    soilTypeDetected: Optional[str] = None
    nutrients: Optional[dict] = None


class RecommendCropsRequest(BaseModel):
    soil: SoilInput
    season: str
    risks: List[RiskInput] = []
    candidateCrops: List[CandidateCropInput]


class PredictYieldRequest(BaseModel):
    soil: SoilInput
    crop: CandidateCropInput
    risks: List[RiskInput] = []


# ---------- Routes ----------

@router.post("/analyze-soil")
async def analyze_soil(
    image: UploadFile = File(...),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
):
    """Analyzes an uploaded land/soil photograph and returns estimated soil condition."""
    if image.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are supported.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    try:
        result = analyze_soil_image(image_bytes, lat=lat, lng=lng)
        return result
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {exc}") from exc


@router.post("/recommend-crops")
async def recommend_crops_route(payload: RecommendCropsRequest):
    """Ranks candidate crops for a farm based on soil condition, season, and weather risk."""
    try:
        ranked = recommend_crops(
            soil=payload.soil.dict(),
            season=payload.season,
            risks=[r.dict() for r in payload.risks],
            candidate_crops=[c.dict() for c in payload.candidateCrops],
        )
        return {"rankedCrops": ranked}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {exc}") from exc


@router.post("/predict-disease")
async def predict_disease_route(image: UploadFile = File(...)):
    """Predicts visible disease/stress indicators from an uploaded crop-leaf photograph."""
    if image.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are supported.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    try:
        return predict_disease(image_bytes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Disease prediction failed: {exc}") from exc


@router.post("/predict-yield")
async def predict_yield_route(payload: PredictYieldRequest):
    """Estimates expected yield (quintals/acre) for a given farm's soil, crop, and weather risk."""
    try:
        return predict_yield(
            soil=payload.soil.dict(),
            crop=payload.crop.dict(),
            risks=[r.dict() for r in payload.risks],
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Yield prediction failed: {exc}") from exc
