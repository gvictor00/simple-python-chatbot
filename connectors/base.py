from abc import ABC, abstractmethod

from models import ChatRequest, ChatResponse

class ChatConnector(ABC):
    @abstractmethod
    async def send_message(self, request: ChatRequest) -> ChatResponse: ...

    