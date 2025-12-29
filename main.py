# main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from dotenv import load_dotenv

from models import HealthResponseModel, ChatRequest, ChatResponse
from connectors.openai_connector import OpenAIConnector
from services.chat_services import ChatService

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",    # Vite dev server
    "http://localhost:3000",    # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specified origins
    allow_credentials=True, # Allow cookies and credentials
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)

def build_connector():
    provider = os.getenv("PROVIDER", "openai")
    if provider == "openai":
        key = os.environ["OPENAI_API_KEY"]
        return OpenAIConnector(key, os.getenv("OPENAI_MODEL","gpt-3.5-turbo"), os.getenv("SYSTEM_PROMPT","You are a helpful assistant."))
    raise HTTPException(500, f"Provider {provider} not supported")

chat_service = ChatService(build_connector())

# Define chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = await chat_service.reply(request.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Simple Python Chatbot API!"}

@app.get("/health", response_model=HealthResponseModel)
async def health():
    return HealthResponseModel(
        status="healthy", 
        version=os.getenv("VERSION", "1.0.0")
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)