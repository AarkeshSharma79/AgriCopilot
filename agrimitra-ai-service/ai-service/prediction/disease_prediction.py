"""
Orchestrates crop disease prediction: takes raw image bytes, runs
preprocessing, and dispatches to the trained model or heuristic fallback
in models/crop_disease_model/model.py.
"""

from typing import Dict

from preprocessing.image_preprocessing import (
    load_image,
    resize_and_normalize,
    estimate_green_ratio,
    estimate_brown_ratio,
)
from models.crop_disease_model import model as disease_model


def predict_disease(image_bytes: bytes) -> Dict:
    """
    Returns a disease-prediction result dict:
      { "label": str, "confidence": float, "source": "trained_model" | "heuristic_fallback" }
    """
    image = load_image(image_bytes)

    if disease_model.is_trained_model_available():
        tensor = resize_and_normalize(image)
        tensor = tensor.reshape((1,) + tensor.shape)
        try:
            return disease_model.predict_from_tensor(tensor)
        except Exception as exc:  # noqa: BLE001 - fall back rather than fail the request
            print(f"[disease_prediction] Trained model inference failed: {exc}. Using heuristic fallback.")

    green_ratio = estimate_green_ratio(image)
    brown_ratio = estimate_brown_ratio(image)
    return disease_model.predict_from_heuristic(green_ratio, brown_ratio)
