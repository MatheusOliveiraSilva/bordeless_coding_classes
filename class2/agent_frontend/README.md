# Agent Frontend

A modern React frontend interface for the Agent Backend chat system.

## Features

- 🤖 **Chat Interface**: Clean, modern chat interface with real-time streaming
- ⚙️ **Configuration Panel**: Configure LLM provider, model, and reasoning parameters  
- 📡 **Real-time Streaming**: Live streaming of AI responses with token-by-token display
- 🖥️ **Feedback Modal**: Dark, minimalist modal for displaying custom agent feedback
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with smooth animations

## Components

- **App**: Main application container
- **ConfigPanel**: LLM configuration (provider, model, reasoning)
- **ChatInterface**: Main chat functionality
- **MessageList**: Display chat messages with typing indicators
- **MessageInput**: Message input with send/stop controls
- **FeedbackModal**: Dark modal for custom feedback display

## Configuration Options

### LLM Providers
- OpenAI (gpt-4, gpt-4-turbo, gpt-3.5-turbo)
- Azure OpenAI (gpt-4, gpt-35-turbo)
- Anthropic (claude-3-sonnet, claude-3-haiku)

### Reasoning Levels
- Thinking
- High
- Medium
- Low

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Runs the app in development mode on [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## API Integration

The frontend connects to the Agent Backend API at `/agent/chat` and expects:

**Request Format:**
```json
{
  "chat_history": [
    {
      "role": "user",
      "content": "Hello"
    }
  ],
  "llm_config": {
    "model": "gpt-3.5-turbo",
    "reasoning": "medium"
  },
  "llm_provider": "openai",
  "thread_id": "thread-123"
}
```

**Response Format:**
Streaming response with format: `type: chunk`

- `messages: AIMessageChunk(content='...')` - Chat content
- `custom: {...}` - Custom feedback data

## Environment

Make sure the Agent Backend is running on `http://localhost:8000` for the frontend to connect properly.
