# AgriMitra — System Architecture

This document describes how the three main services in this repository
interact: the Node.js backend, the Python AI/ML service, and the React
frontend.

## High-level diagram (described)

```
Farmer
  │
  ▼
React Frontend (Vite)
  │  HTTPS (REST)
  ▼
Node.js/Express Backend  ──────────────►  MongoDB Atlas
  │            │
  │            └───► Weather API (OpenWeatherMap)
  │
  │  HTTP (internal)
  ▼
Python AI/ML Service (FastAPI)
  ├── /analyze-soil        → soil condition estimate
  ├── /recommend-crops     → ranked crop list
  ├── /predict-disease     → disease/stress indicator (heuristic or trained CNN)
  └── /predict-yield       → yield estimate (heuristic or trained regressor)
```

## Service responsibilities

- **Frontend**: farmer-facing UI, authentication flows, farm/crop management, display of recommendations and alerts.
- **Backend**: authentication, request orchestration, persistence, weather-risk detection and alerting, calls out to the AI service for anything ML-related.
- **AI/ML service**: stateless prediction endpoints; each prediction module independently falls back to a rule-based/heuristic estimate when no trained model file is present, so the platform degrades gracefully rather than failing outright.

## Data flow for a typical request (crop recommendation)

1. Farmer requests a crop recommendation for a farm via the frontend.
2. Backend loads the farm's latest soil analysis and most recent weather-risk data from MongoDB.
3. Backend calls the AI service's `/recommend-crops` endpoint with soil, season, risk, and candidate-crop data.
4. AI service scores each candidate crop (trained model if available, otherwise rule-based scoring) and returns a ranked list.
5. Backend returns the ranked list to the frontend for display.

## Extension points

- Swapping a heuristic for a trained model requires only adding the model file to the relevant `models/<name>/` folder — the wrapper modules already check for the file's presence and load it automatically.
- New prediction types should follow the same pattern: a `models/<new_model>/model.py` wrapper, a `prediction/<new_prediction>.py` orchestration module, and a route added to `routes/prediction_routes.py`.
