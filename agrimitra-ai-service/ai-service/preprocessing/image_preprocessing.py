"""
Image preprocessing utilities used by both the soil-analysis and
disease-prediction pipelines.

Two tiers of feature extraction are provided:
  1. Basic resize/normalize for feeding into a CNN (used once a trained
     model file is present under models/crop_disease_model/).
  2. Lightweight color/texture heuristics, used as an honest fallback when
     no trained model is available, so the service degrades gracefully
     instead of returning a hard failure.
"""

from io import BytesIO
from typing import Tuple

import numpy as np
from PIL import Image, ImageStat


def load_image(image_bytes: bytes) -> Image.Image:
    """Loads raw bytes into a PIL Image, converting to RGB."""
    image = Image.open(BytesIO(image_bytes))
    return image.convert("RGB")


def resize_and_normalize(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Resizes an image to the target size and normalizes pixel values to [0, 1].
    Produces the input tensor shape expected by most CNN architectures
    (e.g., MobileNet/ResNet-style models trained at 224x224).
    """
    resized = image.resize(target_size)
    arr = np.asarray(resized, dtype=np.float32) / 255.0
    return arr


def extract_color_stats(image: Image.Image) -> dict:
    """
    Extracts basic per-channel color statistics (mean, stddev) used by the
    heuristic fallback models. These are not a substitute for a trained
    model, but provide a deterministic, explainable estimate when no model
    weights are available.
    """
    stat = ImageStat.Stat(image)
    r_mean, g_mean, b_mean = stat.mean
    r_std, g_std, b_std = stat.stddev

    return {
        "mean": {"r": r_mean, "g": g_mean, "b": b_mean},
        "stddev": {"r": r_std, "g": g_std, "b": b_std},
        "brightness": (r_mean + g_mean + b_mean) / 3,
    }


def estimate_green_ratio(image: Image.Image) -> float:
    """
    Estimates the proportion of "green" pixels in an image, used as a crude
    proxy for vegetation health/density in the disease-prediction fallback.
    A real implementation should replace this with a trained classifier.
    """
    arr = np.asarray(image, dtype=np.int16)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    green_mask = (g > r) & (g > b) & (g > 60)
    green_ratio = float(np.mean(green_mask))
    return green_ratio


def estimate_brown_ratio(image: Image.Image) -> float:
    """
    Estimates the proportion of "brown/dry" pixels, used as a crude proxy
    for soil exposure or dried/wilted vegetation in the fallback heuristics.
    """
    arr = np.asarray(image, dtype=np.int16)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    brown_mask = (r > 80) & (r < 200) & (g > 50) & (g < 160) & (b < 120) & (r > g) & (g >= b)
    brown_ratio = float(np.mean(brown_mask))
    return brown_ratio
