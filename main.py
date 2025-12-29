# main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from dotenv import load_dotenv

from models import HealthResponseModel, ChatRequest, ChatResponse

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Retrieve OpenAI API key from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")

# Create OpenAI client
openai_client = OpenAI(api_key=openai_api_key)

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

# Define chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Call OpenAI API to get a response
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": request.message},
            ],
        )
        reply = response.choices[0].message.content.strip()
        return ChatResponse(reply=reply)
    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    
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