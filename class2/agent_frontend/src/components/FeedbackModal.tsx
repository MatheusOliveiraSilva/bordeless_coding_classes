import React from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  content: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ content, onClose }) => {
  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-header">
          <h3>Agent Feedback</h3>
          <button className="close-button" onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="feedback-content">
          <pre className="feedback-text">{content}</pre>
        </div>
        
        <div className="feedback-actions">
          <button className="close-action-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 