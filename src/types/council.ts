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

// Streaming response types
export interface OpenRouterStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }>;
}

// Enhanced request with Level 1 features
export interface EnhancedOpenRouterRequest extends OpenRouterRequest {
  metadata?: {
    user_id?: string;
    session_id?: string;
    task_complexity?: 'low' | 'medium' | 'high';
    priority?: 'speed' | 'quality' | 'cost';
    budget_limit?: number;
    cache_key?: string;
  };
}

// Cost tracking types
export interface CostTracker {
  total_tokens: number;
  total_cost: number;
  requests_count: number;
  session_cost: number;
  budget_limit?: number;
  cost_per_model: Record<string, number>;
}

// Model selection types
export interface ModelSelectionCriteria {
  task_type: 'reasoning' | 'creative' | 'analytical' | 'conversational' | 'planning';
  complexity: 'low' | 'medium' | 'high';
  priority: 'speed' | 'quality' | 'cost';
  context_length_needed: number;
  budget_remaining?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  cost_per_token: number;
  context_length: number;
  strengths: string[];
  speed_score: number; // 1-10
  quality_score: number; // 1-10
  cost_score: number; // 1-10 (higher = cheaper)
}

// Cache types
export interface CacheEntry {
  key: string;
  response: string;
  agent: CouncilAgent;
  timestamp: number;
  ttl: number;
  usage_count: number;
}

// Error handling types
export interface RetryConfig {
  max_attempts: number;
  base_delay: number;
  max_delay: number;
  backoff_factor: number;
}

export interface OpenRouterError {
  type: 'rate_limit' | 'model_unavailable' | 'insufficient_quota' | 'network' | 'unknown';
  message: string;
  retry_after?: number;
  suggested_model?: string;
}

// Streaming generator type
export type StreamingResponse = AsyncGenerator<{
  content: string;
  agent: CouncilAgent;
  isComplete: boolean;
  error?: OpenRouterError;
}, void, unknown>;
