# AgriMitra

AI-powered agricultural advisory platform — an integrated system combining
soil analysis, weather-risk alerting, crop recommendation, and irrigation
guidance for smallholder farmers.

## Repository structure

```
.
├── backend/          # Node.js + Express REST API (auth, farms, soil, weather, crops, recommendations)
├── ai-service/        # Python + FastAPI AI/ML service (soil analysis, crop/yield prediction, disease detection)
├── docs/
│   ├── architecture/  # System architecture documentation
│   ├── api/            # API reference documentation
│   └── project-report/ # Final submission documents (synopsis, deck, report)
├── docker-compose.yml
└── .gitignore
```

The frontend (React/Vite) lives in a separate repository/folder and is not
included here; see its own README for setup instructions.

## Getting started (local development)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, AI_SERVICE_URL, etc.
npm run dev
```

### 2. AI/ML service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env .env.local          # adjust as needed
uvicorn app:app --host 0.0.0.0 --port 6000 --reload
```

Check `GET http://localhost:6000/health` to confirm the service is running
and see which prediction modules are on a trained model versus their
fallback.

### 3. Full stack with Docker Compose

```bash
docker compose up --build
```

This starts MongoDB, the Node.js backend, and the Python AI service
together. The frontend is run separately and pointed at
`http://localhost:5000` for the backend API.

## Current implementation status

Implemented in this repository:

- Farmer authentication, farm/crop profile management (backend).
- Photo-based soil analysis using a color-heuristic estimate (ai-service);
  designed to be replaced by a trained model once labeled soil data is
  available.
- Weather forecast retrieval and threshold-based risk alerting (backend +
  third-party weather API).
- Rule-based crop recommendation and irrigation/fertilizer guidance
  (backend + ai-service, consistent scoring logic in both).
- Push/SMS alert delivery for high-severity weather risk.

Proposed / planned, not yet backed by a trained model:

- CNN-based crop disease classification (scaffold present in
  `ai-service/models/crop_disease_model/`, pending a labeled dataset).
- Yield prediction from historical outcome data (scaffold present in
  `ai-service/models/yield_prediction_model/`, pending historical yield
  records).
- Conversational AI assistant.

See `docs/architecture/README.md` for a fuller description of how the
services fit together, and `docs/api/README.md` for the AI service's API
reference.
