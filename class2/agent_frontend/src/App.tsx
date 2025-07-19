import React, { useState } from 'react';
import './App.css';
import { ChatInterface } from './components/ChatInterface';
import { ConfigPanel } from './components/ConfigPanel';
import { LLMConfig, LLMProvider, ChatMessage } from './types';

function App() {
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    model: "gpt-3.5-turbo",
    reasoning: "medium"
  });
  const [llmProvider, setLLMProvider] = useState<LLMProvider>("openai");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [threadId] = useState<string>(`thread-${Date.now()}`);

  return (
    <div className="app">
      <div className="app-header">
        <h1>Agent Chat Interface</h1>
      </div>
      
      <div className="app-content">
        <div className="config-section">
          <ConfigPanel
            llmConfig={llmConfig}
            llmProvider={llmProvider}
            onConfigChange={setLLMConfig}
            onProviderChange={setLLMProvider}
          />
        </div>
        
        <div className="chat-section">
          <ChatInterface
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            llmConfig={llmConfig}
            llmProvider={llmProvider}
            threadId={threadId}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 