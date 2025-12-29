from abc import ABC, abstractmethod

from models import ChatRequest, ChatResponse

class ChatConnector(ABC):
    @abstractmethod
    async def chat(self, request: ChatRequest) -> ChatResponse: ...

