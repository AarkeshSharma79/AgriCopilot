import os
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional
# pyrefly: ignore [missing-import]
from qdrant_client import QdrantClient
# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="Farmer AI Assistant RAG Service")

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "farmer_knowledge_base")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "intfloat/multilingual-e5-large")
LLM_API_KEY = os.getenv("LLM_API_KEY")

qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

if LLM_API_KEY:
    genai.configure(api_key=LLM_API_KEY)

class ChatRequest(BaseModel):
    query: str
    language: str = "en"
    crop: Optional[str] = None
    state: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    language: str

@app.post("/api/farmer-chat", response_model=ChatResponse)
def farmer_chat(request: ChatRequest):
    try:
        # Embed query
        query_vector = embedding_model.encode(request.query).tolist()
        
        # Build filter
        must_conditions = []
        if request.crop:
            must_conditions.append({"key": "crop", "match": {"value": request.crop}})
        if request.state:
            must_conditions.append({"key": "state", "match": {"value": request.state}})
        
        query_filter = {"must": must_conditions} if must_conditions else None
        
        # Search Qdrant
        search_result = qdrant.search(
            collection_name=QDRANT_COLLECTION_NAME,
            query_vector=query_vector,
            query_filter=query_filter,
            limit=5
        )
        
        context_texts = [hit.payload.get("text", "") for hit in search_result]
        context = "\n\n".join(context_texts)
        
        # Call LLM
        prompt = f"""
You are an AI assistant for Indian farmers. Answer the following question based ONLY on the provided context. 
If the answer is not in the context, say you don't know. Keep the language simple.

Context:
{context}

Question:
{request.query}
"""
        
        # Simplified LLM call using Gemini (can be adapted)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        answer = response.text

        # Bhashini translation would ideally happen here if needed, but since it's an external API
        # and instructions said "reuse existing Bhashini integration", if it exists.
        # Since we're in a separate service, we just return the answer and let the orchestrator/frontend handle TTS/Translation if needed.
        # Or we can return it as is.
        
        return ChatResponse(answer=answer, language=request.language)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
