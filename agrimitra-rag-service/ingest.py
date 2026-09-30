import os
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer
# pyrefly: ignore [missing-import]
from qdrant_client import QdrantClient
# pyrefly: ignore [missing-import]
from qdrant_client.models import Distance, VectorParams
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import pdfplumber
import uuid

load_dotenv()

app = FastAPI(title="Ingestion Service")

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "farmer_knowledge_base")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "intfloat/multilingual-e5-large")

qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

def init_collection():
    try:
        qdrant.get_collection(collection_name=QDRANT_COLLECTION_NAME)
    except:
        vector_size = embedding_model.get_sentence_embedding_dimension()
        qdrant.create_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )

init_collection()

@app.post("/api/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    crop: str = Form(None),
    state: str = Form(None),
    season: str = Form(None),
    source: str = Form(None),
    language: str = Form("en")
):
    try:
        content = ""
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.file) as pdf:
                for page in pdf.pages:
                    content += page.extract_text() + "\n"
        else:
            content = (await file.read()).decode("utf-8")
        
        # Simple chunking by paragraph
        chunks = [c.strip() for c in content.split("\n\n") if len(c.strip()) > 50]
        
        points = []
        for chunk in chunks:
            vector = embedding_model.encode(chunk).tolist()
            payload = {
                "crop": crop,
                "state": state,
                "season": season,
                "source": source,
                "language": language,
                "text": chunk
            }
            points.append({
                "id": str(uuid.uuid4()),
                "vector": vector,
                "payload": payload
            })
            
        qdrant.upsert(
            collection_name=QDRANT_COLLECTION_NAME,
            points=points
        )
        return {"message": f"Successfully ingested {len(chunks)} chunks"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
