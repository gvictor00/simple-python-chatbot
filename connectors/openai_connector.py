from models import ChatRequest, ChatResponse
from connectors.base import ChatConnector
import os
from openai import OpenAI, OpenAIError

class OpenAIConnector(ChatConnector):
    client = None

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def send_message(self, request: ChatRequest) -> ChatResponse:
        try:
            response = await self.client.chat.completions.acreate(
                model=os.getenv("OPENAI_MODEL"),
                messages=[
                    {"role": "system", "content": os.getenv("SYSTEM_PROMPT")},
                    {"role": "user", "content": request.message}
                ]
            )
            
            reply = response.choices[0].message['content']
            return ChatResponse(reply=reply)
        except Exception as e:
            raise e
        except OpenAIError as e:
            raise e