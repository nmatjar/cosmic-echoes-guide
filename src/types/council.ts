// Types for Council Chat functionality

export interface ChatSession {
  session_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  intention?: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  message_id: string;
  session_id: string;
  agent_id?: string; // null for user messages, agent name for agent messages
  author: 'user' | 'agent';
  content: string;
  timestamp: string;
  created_at: string;
}

export type CouncilAgent = 
  | 'architect'
  | 'oracle' 
  | 'alchemist'
  | 'pioneer'
  | 'chronicler'
  | 'echo';

export interface CouncilAgentConfig {
  id: CouncilAgent;
  name: string;
  avatar: string;
  description: string;
  specialization: string[];
  perspective: string;
  exampleQuestion: string;
}

export interface CouncilResponse {
  agent: CouncilAgent;
  content: string;
  timestamp: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens?: number;
  };
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
