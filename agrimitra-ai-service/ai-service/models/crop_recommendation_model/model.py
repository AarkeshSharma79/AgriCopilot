"""
Crop recommendation model wrapper.

If a trained model file is present at
models/crop_recommendation_model/model.pkl (a scikit-learn classifier or
ranking model saved with joblib), it is loaded and used to score candidate
crops.

If no trained model is present, scoring falls back to the same rule-based
logic used by the Node.js backend's aiService.js fallback path, so both
services degrade consistently when ML infrastructure or training data is
not yet available.
"""

import os
from typing import Dict, List

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

_model = None


def _load_trained_model():
    global _model

    if _model is not None:
        return _model

    if not os.path.exists(MODEL_PATH):
        return None

    try:
        import joblib
        _model = joblib.load(MODEL_PATH)
        return _model
    except Exception as exc:  # noqa: BLE001
        print(f"[crop_recommendation_model] Failed to load trained model: {exc}. Using rule-based fallback.")
        return None


def is_trained_model_available() -> bool:
    return os.path.exists(MODEL_PATH)


def score_with_trained_model(features: List[List[float]]) -> List[float]:
    """
    Scores candidate crops using the trained model. `features` should be a
    list of numeric feature vectors, one per candidate crop, built by the
    caller according to the schema the model was trained on.
    """
    model = _load_trained_model()
    if model is None:
        raise RuntimeError("No trained crop-recommendation model is available.")

    if hasattr(model, "predict_proba"):
        return [float(p[1]) for p in model.predict_proba(features)]
    return [float(s) for s in model.predict(features)]


def score_with_rules(soil: Dict, season: str, risks: List[Dict], candidate_crop: Dict) -> float:
    """
    Rule-based scoring for a single candidate crop, mirroring the logic in
    the Node.js backend's ruleBasedCropRanking function, so recommendations
    stay consistent regardless of which service ends up handling a request.
    """
    if candidate_crop.get("season") != season:
        return 0.0

    score = 50.0

    ph = soil.get("ph")
    ideal_ph = candidate_crop.get("idealSoilPH", {}) or {}
    if ph is not None and ideal_ph.get("min") is not None and ideal_ph.get("max") is not None:
        if ideal_ph["min"] <= ph <= ideal_ph["max"]:
            score += 20

    soil_type = soil.get("soilTypeDetected")
    if soil_type and soil_type in (candidate_crop.get("idealSoilType") or []):
        score += 15

    has_drought_risk = any(r.get("type") == "drought" for r in risks)
    has_frost_risk = any(r.get("type") == "frost" for r in risks)

    if has_drought_risk and candidate_crop.get("droughtTolerant"):
        score += 10
    if has_frost_risk and candidate_crop.get("frostSensitive"):
        score -= 20

    return max(0.0, min(100.0, score))
