import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LLMConfig, LLMProvider, AgentRequest } from '../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FeedbackModal } from './FeedbackModal';
import './ChatInterface.css';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  llmConfig: LLMConfig;
  llmProvider: LLMProvider;
  threadId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  setChatHistory,
  llmConfig,
  llmProvider,
  threadId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    
    // Reset current response
    setCurrentResponse('');
    setIsLoading(true);

    // Create abort controller for this request
    abortController.current = new AbortController();

    try {
      const request: AgentRequest = {
        chat_history: newHistory,
        llm_config: llmConfig,
        llm_provider: llmProvider,
        thread_id: threadId,
      };

      const response = await fetch('/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortController.current.signal,
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              const type = line.substring(0, colonIndex).trim();
              const data = line.substring(colonIndex + 1).trim();

              if (type === 'custom') {
                // Handle custom feedback
                setFeedbackContent(data);
                setShowFeedback(true);
              } else if (type === 'messages') {
                // Parse the message content
                try {
                  // Extract content from the AIMessageChunk
                  const match = data.match(/AIMessageChunk\(content='([^']*?)'/);
                  if (match && match[1]) {
                    accumulatedContent += match[1];
                    setCurrentResponse(accumulatedContent);
                  }
                } catch (error) {
                  console.error('Error parsing message:', error);
                }
              }
            }
          }
        }
      }

      // Add final response to chat history
      if (accumulatedContent) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: accumulatedContent,
        };
        setChatHistory([...newHistory, assistantMessage]);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: `Error: ${error.message}`,
        };
        setChatHistory([...newHistory, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
      abortController.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
    setFeedbackContent('');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Chat</h2>
        <div className="thread-info">
          Thread ID: {threadId}
        </div>
      </div>
      
      <div className="chat-content">
        <MessageList 
          messages={chatHistory} 
          currentResponse={currentResponse}
          isLoading={isLoading}
        />
      </div>
      
      <MessageInput 
        onSend={sendMessage} 
        isLoading={isLoading}
        onStop={stopGeneration}
      />

      {showFeedback && (
        <FeedbackModal 
          content={feedbackContent}
          onClose={closeFeedback}
        />
      )}
    </div>
  );
}; 