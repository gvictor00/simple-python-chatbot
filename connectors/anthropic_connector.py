import anthropic
import os 
from models import ChatRequest, ChatResponse
from connectors.base import ChatConnector

class AnthropicConnector(ChatConnector):
    client = None
    model = None
    system_prompt = None

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = os.getenv("ANTHROPIC_MODEL", "claude-2")
        self.system_prompt = os.getenv("SYSTEM_PROMPT", "You are a helpful assistant.")

    async def chat(self, request: ChatRequest) -> ChatResponse:
        try:
            response = await self.messages.create(
                model=self.model,
                max_tokens=150,
                messages = [{
                    "role": "user", 
                    "content": [{
                        "type": "text", 
                        "text": request.message
                        }]
                    }]
                )
            
            reply = response.completion
            return ChatResponse(reply=reply)
        except Exception as e:
            raise e