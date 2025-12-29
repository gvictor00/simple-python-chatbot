from models import ChatRequest, ChatResponse
from connectors.base import ChatConnector
import os
from openai import OpenAI, OpenAIError

class OpenAIConnector(ChatConnector):
    client = None
    model = None
    system_prompt = None

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.system_prompt = os.getenv("SYSTEM_PROMPT", "You are a helpful assistant.")

    async def chat(self, request: ChatRequest) -> ChatResponse:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": request.message}
                ]
            )
            
            reply = response.choices[0].message['content']
            return ChatResponse(reply=reply)
        except Exception as e:
            raise e