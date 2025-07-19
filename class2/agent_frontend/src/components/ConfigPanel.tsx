import React from 'react';
import { LLMConfig, LLMProvider, ReasoningConfig } from '../types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  llmConfig: LLMConfig;
  llmProvider: LLMProvider;
  onConfigChange: (config: LLMConfig) => void;
  onProviderChange: (provider: LLMProvider) => void;
}

const PROVIDER_OPTIONS: { value: LLMProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'azure_openai', label: 'Azure OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
];

const MODEL_OPTIONS: Record<LLMProvider, string[]> = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  azure_openai: ['gpt-4', 'gpt-35-turbo'],
  anthropic: ['claude-3-sonnet', 'claude-3-haiku'],
};

const REASONING_OPTIONS: { value: ReasoningConfig; label: string }[] = [
  { value: 'thinking', label: 'Thinking' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  llmConfig,
  llmProvider,
  onConfigChange,
  onProviderChange,
}) => {
  const handleProviderChange = (provider: LLMProvider) => {
    onProviderChange(provider);
    // Reset model to first available option for new provider
    onConfigChange({
      ...llmConfig,
      model: MODEL_OPTIONS[provider][0],
    });
  };

  const handleModelChange = (model: string) => {
    onConfigChange({
      ...llmConfig,
      model,
    });
  };

  const handleReasoningChange = (reasoning: ReasoningConfig) => {
    onConfigChange({
      ...llmConfig,
      reasoning,
    });
  };

  return (
    <div className="config-panel">
      <h2>Configuration</h2>
      
      <div className="config-group">
        <label htmlFor="provider">Provider:</label>
        <select
          id="provider"
          value={llmProvider}
          onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
          className="config-select"
        >
          {PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="config-group">
        <label htmlFor="model">Model:</label>
        <select
          id="model"
          value={llmConfig.model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="config-select"
        >
          {MODEL_OPTIONS[llmProvider].map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="config-group">
        <label htmlFor="reasoning">Reasoning:</label>
        <select
          id="reasoning"
          value={llmConfig.reasoning || 'medium'}
          onChange={(e) => handleReasoningChange(e.target.value as ReasoningConfig)}
          className="config-select"
        >
          {REASONING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="config-summary">
        <h3>Current Config:</h3>
        <div className="summary-item">
          <strong>Provider:</strong> {llmProvider}
        </div>
        <div className="summary-item">
          <strong>Model:</strong> {llmConfig.model}
        </div>
        <div className="summary-item">
          <strong>Reasoning:</strong> {llmConfig.reasoning}
        </div>
      </div>
    </div>
  );
}; 