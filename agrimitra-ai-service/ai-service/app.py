"""
AgriMitra AI/ML Service — FastAPI application entry point.

Run locally with:
    uvicorn app:app --host 0.0.0.0 --port 6000 --reload

The Node.js backend (services/aiService.js) expects this service to be
reachable at AI_SERVICE_URL, defaulting to http://localhost:6000.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.prediction_routes import router as prediction_router
from models.crop_disease_model import model as disease_model
from models.crop_recommendation_model import model as crop_model
from models.yield_prediction_model import model as yield_model

load_dotenv()

app = FastAPI(
    title="AgriMitra AI/ML Service",
    description="Soil analysis, crop recommendation, disease prediction, and yield prediction for AgriMitra.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="", tags=["predictions"])


@app.get("/health")
def health_check():
    """
    Reports service status along with which prediction modules are backed
    by a trained model versus running on their heuristic fallback, so the
    Node.js backend (or an operator) can see at a glance what's live.
    """
    return {
        "status": "ok",
        "models": {
            "crop_disease_model": "trained" if disease_model.is_trained_model_available() else "heuristic_fallback",
            "crop_recommendation_model": "trained" if crop_model.is_trained_model_available() else "rule_based_fallback",
            "yield_prediction_model": "trained" if yield_model.is_trained_model_available() else "heuristic_fallback",
        },
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("AI_SERVICE_PORT", 6000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
