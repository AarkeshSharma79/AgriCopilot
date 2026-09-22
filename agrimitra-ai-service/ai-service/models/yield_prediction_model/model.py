"""
Yield prediction model wrapper.

If a trained regression model file is present at
models/yield_prediction_model/model.pkl (a scikit-learn regressor saved
with joblib), it is loaded and used to estimate yield in quintals per acre.

If no trained model is present, a simple, clearly-labeled heuristic
estimate is returned based on a crop's reference yield potential, adjusted
by soil fertility and weather risk. This is a placeholder pending real
historical yield data and should not be presented as a validated
prediction.
"""

import os
from typing import Dict, List, Optional

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

_model = None

# Reference yield potential (quintals/acre) used only by the heuristic
# fallback, when no trained model / historical data is available.
_DEFAULT_BASE_YIELD_QTL_PER_ACRE = 15.0


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
        print(f"[yield_prediction_model] Failed to load trained model: {exc}. Using heuristic fallback.")
        return None


def is_trained_model_available() -> bool:
    return os.path.exists(MODEL_PATH)


def predict_with_trained_model(features: List[float]) -> float:
    """Predicts yield (quintals/acre) using the trained regression model."""
    model = _load_trained_model()
    if model is None:
        raise RuntimeError("No trained yield-prediction model is available.")

    prediction = model.predict([features])
    return float(prediction[0])


def predict_with_heuristic(
    soil: Dict,
    risks: List[Dict],
    base_yield_qtl_per_acre: Optional[float] = None,
) -> Dict:
    """
    Heuristic fallback yield estimate. Applies simple multiplicative
    adjustments to a reference base yield based on soil fertility score and
    active weather risks. Intended only as a placeholder until a model is
    trained on real historical yield outcomes.
    """
    base = base_yield_qtl_per_acre or _DEFAULT_BASE_YIELD_QTL_PER_ACRE

    fertility_score = soil.get("fertilityScore", 55)
    fertility_factor = 0.7 + (fertility_score / 100) * 0.6  # ranges roughly 0.7 - 1.3

    risk_penalty = 1.0
    for risk in risks:
        if risk.get("severity") == "high":
            risk_penalty -= 0.15
        elif risk.get("severity") == "medium":
            risk_penalty -= 0.07
    risk_penalty = max(0.4, risk_penalty)

    estimated_yield = round(base * fertility_factor * risk_penalty, 2)

    return {
        "estimatedYieldQtlPerAcre": estimated_yield,
        "source": "heuristic_fallback",
        "note": "Placeholder estimate based on reference yield, soil fertility, and weather risk. "
                "Not derived from a trained model or historical yield data.",
    }
