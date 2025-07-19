export type LLMProvider = "azure_openai" | "openai" | "anthropic";
export type ReasoningConfig = "thinking" | "high" | "medium" | "low";

export interface LLMConfig {
  model: string;
  reasoning?: ReasoningConfig;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentRequest {
  chat_history: ChatMessage[];
  llm_config: LLMConfig;
  llm_provider: LLMProvider;
  thread_id: string;
}

export interface StreamChunk {
  type: "custom" | "messages";
  data: any;
} 