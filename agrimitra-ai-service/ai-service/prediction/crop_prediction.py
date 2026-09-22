"""
Orchestrates two related capabilities:
  1. Soil analysis from an uploaded land/soil photograph.
  2. Crop recommendation ranking, combining soil condition, season, and
     weather risk.

Soil analysis does not yet have a dedicated trained model in this project;
it uses the color-heuristic fallback in preprocessing/image_preprocessing.py.
Replacing this with a trained regression/classification model (soil moisture,
fertility, pH, nutrients) is a natural next step once labeled soil-image
data is available — see dataset/soil/README.md.
"""

from typing import Dict, List

from preprocessing.image_preprocessing import (
    load_image,
    extract_color_stats,
    estimate_green_ratio,
    estimate_brown_ratio,
)
from models.crop_recommendation_model import model as crop_model


def analyze_soil_image(image_bytes: bytes, lat: float = None, lng: float = None) -> Dict:
    """
    Estimates soil condition from an uploaded photograph using color-based
    heuristics. Returns a dict matching the schema expected by the Node.js
    backend's Soil model (moisturePercent, fertilityScore, ph, nutrients,
    soilTypeDetected, confidenceScore).

    This is an explicit placeholder: color statistics from an RGB photo are
    a weak proxy for true soil chemistry. Confidence is deliberately kept
    low to reflect this, and the response is clearly labeled as a heuristic
    estimate.
    """
    image = load_image(image_bytes)
    stats = extract_color_stats(image)
    brown_ratio = estimate_brown_ratio(image)
    green_ratio = estimate_green_ratio(image)

    # Darker, less saturated soil tends to correlate loosely with higher
    # organic content / moisture in visual inspection — used only as a
    # rough directional signal, not a calibrated measurement.
    brightness = stats["brightness"]
    moisture_percent = max(10.0, min(80.0, 90.0 - (brightness / 255.0) * 70.0))
    fertility_score = max(20.0, min(85.0, 40.0 + brown_ratio * 60.0))

    if brightness < 90:
        soil_type = "black"
    elif stats["mean"]["r"] > stats["mean"]["g"] > stats["mean"]["b"] and brightness < 150:
        soil_type = "red"
    elif brightness > 190:
        soil_type = "arid"
    else:
        soil_type = "alluvial"

    return {
        "moisturePercent": round(moisture_percent, 1),
        "fertilityScore": round(fertility_score, 1),
        "ph": 6.5,  # cannot be estimated from a photo; held at a neutral default
        "nutrients": {
            "nitrogen": "medium",
            "phosphorus": "medium",
            "potassium": "medium",
        },
        "soilTypeDetected": soil_type,
        "confidenceScore": 0.3,
        "source": "heuristic_fallback",
        "note": "Estimated from image color statistics only. Replace with a trained model "
                "and/or lab-calibrated sensor data for production-grade accuracy.",
    }


def recommend_crops(soil: Dict, season: str, risks: List[Dict], candidate_crops: List[Dict]) -> List[Dict]:
    """
    Ranks candidate crops for a farm. Uses the trained recommendation model
    if available; otherwise falls back to the same rule-based scoring
    logic used by the Node.js backend, so both services stay consistent.
    """
    results = []

    use_trained_model = crop_model.is_trained_model_available()

    for crop in candidate_crops:
        if crop.get("season") != season:
            continue

        if use_trained_model:
            try:
                features = _build_feature_vector(soil, crop, risks)
                score = crop_model.score_with_trained_model([features])[0] * 100
            except Exception as exc:  # noqa: BLE001
                print(f"[crop_prediction] Trained model scoring failed: {exc}. Using rule-based fallback.")
                score = crop_model.score_with_rules(soil, season, risks, crop)
        else:
            score = crop_model.score_with_rules(soil, season, risks, crop)

        results.append({"crop": crop, "score": round(score, 1)})

    results.sort(key=lambda r: r["score"], reverse=True)
    return results


def _build_feature_vector(soil: Dict, crop: Dict, risks: List[Dict]) -> List[float]:
    """
    Builds a numeric feature vector for the trained crop-recommendation
    model. The exact feature order must match what the model was trained
    on — update this function alongside any retraining.
    """
    ideal_ph = crop.get("idealSoilPH", {}) or {}
    return [
        soil.get("ph", 6.5),
        soil.get("moisturePercent", 40.0),
        soil.get("fertilityScore", 50.0),
        ideal_ph.get("min", 5.5),
        ideal_ph.get("max", 7.5),
        1.0 if any(r.get("type") == "drought" for r in risks) else 0.0,
        1.0 if any(r.get("type") == "frost" for r in risks) else 0.0,
        1.0 if crop.get("droughtTolerant") else 0.0,
        1.0 if crop.get("frostSensitive") else 0.0,
    ]
