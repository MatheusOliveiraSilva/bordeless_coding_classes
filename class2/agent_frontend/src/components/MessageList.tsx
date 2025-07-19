import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import './MessageList.css';

interface MessageListProps {
  messages: ChatMessage[];
  currentResponse: string;
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentResponse,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Welcome to the Agent Chat!</h3>
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-header">
              <span className="message-role">
                {message.role === 'user' ? '👤 You' : '🤖 Assistant'}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {(currentResponse || isLoading) && (
          <div className="message assistant">
            <div className="message-header">
              <span className="message-role">🤖 Assistant</span>
              {isLoading && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
            <div className="message-content">
              {currentResponse}
              {isLoading && <span className="cursor">|</span>}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}; 