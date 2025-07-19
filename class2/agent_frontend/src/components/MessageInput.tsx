import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading,
  onStop,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="message-textarea"
            disabled={isLoading}
            rows={1}
          />
          
          <div className="button-container">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="stop-button"
                title="Stop generation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="send-button"
                disabled={!message.trim() || isLoading}
                title="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2L11 13" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="input-hint">
          <span className="hint-text">
            {isLoading ? 'Generating response...' : 'Press Enter to send, Shift+Enter for new line'}
          </span>
        </div>
      </form>
    </div>
  );
}; 