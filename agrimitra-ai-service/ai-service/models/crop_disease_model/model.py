"""
Crop disease classification model wrapper.

If a trained model file is present at models/crop_disease_model/model.h5,
it is loaded and used for inference (expects a Keras/TensorFlow model
trained on a labeled leaf-image dataset, e.g. PlantVillage).

If no trained model is present, predictions fall back to a simple,
clearly-labeled heuristic based on color statistics (green/brown pixel
ratio). This fallback is NOT a disease classifier — it only distinguishes
"appears healthy/green" from "shows visible discoloration" and should be
replaced with a trained model before any claim of disease detection
accuracy is made.
"""

import os
from typing import Dict

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.h5")
LABELS_PATH = os.path.join(MODEL_DIR, "labels.txt")

_model = None
_labels = None


def _load_trained_model():
    """Lazily loads the TensorFlow/Keras model, if present, on first use."""
    global _model, _labels

    if _model is not None:
        return _model

    if not os.path.exists(MODEL_PATH):
        return None

    try:
        import tensorflow as tf  # heavy import — deferred until a model actually exists
        _model = tf.keras.models.load_model(MODEL_PATH)

        if os.path.exists(LABELS_PATH):
            with open(LABELS_PATH, "r", encoding="utf-8") as f:
                _labels = [line.strip() for line in f if line.strip()]

        return _model
    except Exception as exc:  # noqa: BLE001 - log and fall back rather than crash the request
        print(f"[crop_disease_model] Failed to load trained model: {exc}. Using heuristic fallback.")
        return None


def is_trained_model_available() -> bool:
    return os.path.exists(MODEL_PATH)


def predict_from_tensor(image_tensor) -> Dict:
    """
    Runs inference using the trained CNN, if available.
    `image_tensor` is expected to be a (1, H, W, 3) float32 array in [0, 1],
    as produced by preprocessing.image_preprocessing.resize_and_normalize.
    """
    model = _load_trained_model()
    if model is None:
        raise RuntimeError("No trained disease-detection model is available.")

    predictions = model.predict(image_tensor)
    top_idx = int(predictions.argmax(axis=-1)[0])
    confidence = float(predictions[0][top_idx])

    label = _labels[top_idx] if _labels and top_idx < len(_labels) else f"class_{top_idx}"

    return {"label": label, "confidence": confidence, "source": "trained_model"}


def predict_from_heuristic(green_ratio: float, brown_ratio: float) -> Dict:
    """
    Heuristic fallback used when no trained model is available. Classifies
    the image into a coarse, low-confidence bucket based on color ratios
    only. This is intentionally conservative and should not be presented to
    end users as a disease diagnosis without a trained-model upgrade.
    """
    if green_ratio >= 0.55:
        label = "appears_healthy"
        confidence = 0.4
    elif brown_ratio >= 0.35:
        label = "possible_stress_or_discoloration"
        confidence = 0.35
    else:
        label = "inconclusive"
        confidence = 0.2

    return {"label": label, "confidence": confidence, "source": "heuristic_fallback"}
