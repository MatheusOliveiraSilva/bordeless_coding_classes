import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  // Configuration state
  const [llmProvider, setLlmProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [reasoning, setReasoning] = useState('medium');
  const [showConfig, setShowConfig] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');

  // Model options for each provider
  const modelOptions = {
    openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
    anthropic: ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-pro-vision']
  };

  // Update model when provider changes
  const handleProviderChange = (newProvider) => {
    setLlmProvider(newProvider);
    setModel(modelOptions[newProvider][0]); // Set to first available model
  };
  
  const [threadId] = useState(() => `thread-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const parseStreamResponse = (chunk) => {
    const lines = chunk.split('\n').filter(line => line.trim());
    let content = '';
    
    for (const line of lines) {
      if (line.startsWith('messages: ')) {
        try {
          // Extract content from the chunk format
          const match = line.match(/content='([^']*?)'/);
          if (match && match[1]) {
            content += match[1];
          }
        } catch (error) {
          console.warn('Error parsing line:', line, error);
        }
      } else if (line.startsWith('custom: ')) {
        // Handle custom type responses
        setShowFeedback(true);
        setFeedbackContent(prev => prev + line.replace('custom: ', '') + '\n');
      }
    }
    
    return content;
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { role: 'user', content: currentMessage.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);
    setStreamingMessage('');
    setShowFeedback(false);
    setFeedbackContent('');

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:8000/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_history: newMessages,
          llm_config: {
            model: model,
            reasoning: reasoning
          },
          llm_provider: llmProvider,
          thread_id: threadId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.trim()) {
              const content = parseStreamResponse(line);
              if (content) {
                accumulatedContent += content;
                setStreamingMessage(accumulatedContent);
              }
            }
          }
        }
      } finally {
        // Process any remaining buffer content
        if (buffer.trim()) {
          const content = parseStreamResponse(buffer);
          if (content) {
            accumulatedContent += content;
          }
        }
        
        // Add the complete AI message to chat history
        if (accumulatedContent) {
          const aiMessage = { role: 'assistant', content: accumulatedContent };
          setMessages(prev => [...prev, aiMessage]);
        }
        
        setStreamingMessage('');
        setIsLoading(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Error: ${error.message}` 
        }]);
      }
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>AI Agent Chat</h1>
        <button 
          className="config-toggle" 
          onClick={() => setShowConfig(!showConfig)}
        >
          ⚙️ Config
        </button>
      </div>

      {showConfig && (
        <div className="config-panel">
          <div className="config-group">
            <label>Provider:</label>
            <select 
              value={llmProvider} 
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
            </select>
          </div>
          
          <div className="config-group">
            <label>Model:</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
            >
              {modelOptions[llmProvider].map((modelName) => (
                <option key={modelName} value={modelName}>
                  {modelName === 'gpt-3.5-turbo' ? 'GPT-3.5 Turbo' :
                   modelName === 'gpt-4' ? 'GPT-4' :
                   modelName === 'gpt-4-turbo' ? 'GPT-4 Turbo' :
                   modelName === 'claude-3-sonnet' ? 'Claude 3 Sonnet' :
                   modelName === 'claude-3-opus' ? 'Claude 3 Opus' :
                   modelName === 'claude-3-haiku' ? 'Claude 3 Haiku' :
                   modelName === 'gemini-pro' ? 'Gemini Pro' :
                   modelName === 'gemini-pro-vision' ? 'Gemini Pro Vision' :
                   modelName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="config-group">
            <label>Reasoning:</label>
            <select 
              value={reasoning} 
              onChange={(e) => setReasoning(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          
          {streamingMessage && (
            <div className="message assistant streaming">
              <div className="message-content">
                {streamingMessage}
                <span className="cursor">|</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            rows="3"
          />
          <div className="input-buttons">
            {isLoading ? (
              <button onClick={stopStreaming} className="stop-btn">
                ⏹ Stop
              </button>
            ) : (
              <button onClick={sendMessage} disabled={!currentMessage.trim()}>
                Send
              </button>
            )}
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="feedback-overlay" onClick={() => setShowFeedback(false)}>
          <div className="feedback-window" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-header">
              <h3>Agent Feedback</h3>
              <button onClick={() => setShowFeedback(false)}>×</button>
            </div>
            <div className="feedback-content">
              <pre>{feedbackContent}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
