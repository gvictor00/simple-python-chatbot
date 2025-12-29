from pydantic import BaseModel

class HealthResponseModel(BaseModel):
    status: str
    version: str

    def __init__(self, status: str, version: str):
        self.status = status
        self.version = version

# Define request body model
class ChatRequest(BaseModel):
    message: str

# Define response model
class ChatResponse(BaseModel):
    reply: str