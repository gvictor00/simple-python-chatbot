from pydantic import BaseModel

# Define health check response model
class HealthResponseModel(BaseModel):
    status: str
    version: str

# Define request body model
class ChatRequest(BaseModel):
    message: str

# Define response model
class ChatResponse(BaseModel):
    reply: str