"""
Orchestrates yield prediction: builds a feature vector when a trained model
is available, otherwise dispatches to the heuristic fallback in
models/yield_prediction_model/model.py.
"""

from typing import Dict, List, Optional

from models.yield_prediction_model import model as yield_model


def predict_yield(soil: Dict, crop: Dict, risks: List[Dict]) -> Dict:
    """
    Returns a yield-prediction result dict. Prefers the trained regression
    model if present; otherwise returns a clearly-labeled heuristic
    estimate.
    """
    if yield_model.is_trained_model_available():
        try:
            features = _build_feature_vector(soil, crop, risks)
            estimated = yield_model.predict_with_trained_model(features)
            return {
                "estimatedYieldQtlPerAcre": round(estimated, 2),
                "source": "trained_model",
            }
        except Exception as exc:  # noqa: BLE001
            print(f"[yield_prediction] Trained model inference failed: {exc}. Using heuristic fallback.")

    base_yield = crop.get("referenceYieldQtlPerAcre")
    return yield_model.predict_with_heuristic(soil, risks, base_yield_qtl_per_acre=base_yield)


def _build_feature_vector(soil: Dict, crop: Dict, risks: List[Dict]) -> List[float]:
    """Builds the numeric feature vector expected by the trained yield-prediction model."""
    return [
        soil.get("ph", 6.5),
        soil.get("moisturePercent", 40.0),
        soil.get("fertilityScore", 50.0),
        crop.get("growthDurationDays", 100),
        sum(1 for r in risks if r.get("severity") == "high"),
        sum(1 for r in risks if r.get("severity") == "medium"),
    ]
