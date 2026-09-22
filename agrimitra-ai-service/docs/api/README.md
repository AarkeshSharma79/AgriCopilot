# AI Service — API Reference

Base URL (local development): `http://localhost:6000`

All endpoints return JSON. Endpoints that use a trained model, when one is
present, include `"source": "trained_model"` in the response; otherwise
`"source": "heuristic_fallback"` or `"rule_based_fallback"`.

---

## `GET /health`

Returns service status and whether each prediction module is running on a
trained model or its fallback.

**Response**
```json
{
  "status": "ok",
  "models": {
    "crop_disease_model": "heuristic_fallback",
    "crop_recommendation_model": "rule_based_fallback",
    "yield_prediction_model": "heuristic_fallback"
  }
}
```

---

## `POST /analyze-soil`

**Content-Type:** `multipart/form-data`

| field | type   | required | description                |
|-------|--------|----------|----------------------------|
| image | file   | yes      | JPEG/PNG/WEBP soil photo   |
| lat   | float  | no       | Farm latitude              |
| lng   | float  | no       | Farm longitude             |

**Response**
```json
{
  "moisturePercent": 42.5,
  "fertilityScore": 58.0,
  "ph": 6.5,
  "nutrients": { "nitrogen": "medium", "phosphorus": "medium", "potassium": "medium" },
  "soilTypeDetected": "alluvial",
  "confidenceScore": 0.3,
  "source": "heuristic_fallback"
}
```

---

## `POST /recommend-crops`

**Content-Type:** `application/json`

```json
{
  "soil": { "ph": 6.5, "moisturePercent": 42.5, "fertilityScore": 58.0, "soilTypeDetected": "alluvial" },
  "season": "kharif",
  "risks": [{ "type": "drought", "severity": "medium" }],
  "candidateCrops": [
    {
      "name": "Pearl Millet",
      "season": "kharif",
      "idealSoilPH": { "min": 5.5, "max": 7.5 },
      "idealSoilType": ["alluvial", "arid"],
      "droughtTolerant": true,
      "frostSensitive": false
    }
  ]
}
```

**Response**
```json
{
  "rankedCrops": [
    { "crop": { "name": "Pearl Millet", "...": "..." }, "score": 85.0 }
  ]
}
```

---

## `POST /predict-disease`

**Content-Type:** `multipart/form-data`

| field | type | required | description                     |
|-------|------|----------|----------------------------------|
| image | file | yes      | JPEG/PNG/WEBP crop-leaf photo    |

**Response**
```json
{ "label": "appears_healthy", "confidence": 0.4, "source": "heuristic_fallback" }
```

---

## `POST /predict-yield`

**Content-Type:** `application/json`

```json
{
  "soil": { "ph": 6.5, "moisturePercent": 42.5, "fertilityScore": 58.0 },
  "crop": { "name": "Wheat", "season": "rabi", "growthDurationDays": 120, "referenceYieldQtlPerAcre": 18 },
  "risks": []
}
```

**Response**
```json
{
  "estimatedYieldQtlPerAcre": 19.8,
  "source": "heuristic_fallback",
  "note": "Placeholder estimate based on reference yield, soil fertility, and weather risk. Not derived from a trained model or historical yield data."
}
```
