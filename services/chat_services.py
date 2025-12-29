from connectors.base import ChatConnector

# services/chat_service.py
class ChatService:
    def __init__(self, connector: ChatConnector): self.connector = connector
    async def reply(self, user_message: str) -> str:
        return await self.connector.chat([{"role": "user", "content": user_message}])
