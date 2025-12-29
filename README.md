# Simple Python Chatbot
Full-Stack AI Chatbot with Python, just for training.

## Features
- Modular architecture with connectors and services
- Support for multiple AI providers (OpenAI, Anthropic)
- FastAPI backend with CORS support
- Pydantic models for request/response validation

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/simple-python-chatbot.git
    cd simple-python-chatbot
    ```

2. Create and activate a virtual environment:
   ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
     pip install -r requirements.txt
     ```

4. Create a `.env` file in the project root and add your API keys:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ANTHROPIC_API_KEY=your_anthropic_api_key
    PROVIDER=openai  # or 'anthropic'
    ```

5. Run the FastAPI server:
    ```bash
     uvicorn main:app --reload
    ```

6. Access the API documentation at `http://localhost:8000/docs`

## Usage
Send a POST request to `/chat` with a JSON body containing the user message:
```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ]
}
``` 

You will receive a response with the AI-generated reply:
```json
{
  "response": "I'm doing well, thank you! How can I assist you today?"
}
```