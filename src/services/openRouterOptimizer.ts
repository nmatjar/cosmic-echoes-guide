import { 
  CostTracker, 
  ModelSelectionCriteria, 
  ModelConfig, 
  CacheEntry, 
  RetryConfig, 
  OpenRouterError 
} from '../types/council';

/**
 * OpenRouter Optimizer - Level 1 Features
 * Handles caching, cost tracking, model selection, and error handling
 */
export class OpenRouterOptimizer {
  private cache = new Map<string, CacheEntry>();
  private costTracker: CostTracker;
  private retryConfig: RetryConfig;
  private modelConfigs: ModelConfig[];

  constructor() {
    this.costTracker = {
      total_tokens: 0,
      total_cost: 0,
      requests_count: 0,
      session_cost: 0,
      cost_per_model: {}
    };

    this.retryConfig = {
      max_attempts: 3,
      base_delay: 1000,
      max_delay: 10000,
      backoff_factor: 2
    };

    this.modelConfigs = this.initializeModelConfigs();
    this.loadCostTracker();
  }

  // 1. ENHANCED ERROR HANDLING WITH RETRY LOGIC
  async withRetry<T>(
    operation: () => Promise<T>,
    context: string = 'OpenRouter operation'
  ): Promise<T> {
    let lastError: OpenRouterError | null = null;
    
    for (let attempt = 1; attempt <= this.retryConfig.max_attempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.parseError(error);
        
        if (!this.shouldRetry(lastError, attempt)) {
          throw lastError;
        }

        const delay = Math.min(
          this.retryConfig.base_delay * Math.pow(this.retryConfig.backoff_factor, attempt - 1),
          this.retryConfig.max_delay
        );

        console.warn(`${context} failed (attempt ${attempt}/${this.retryConfig.max_attempts}). Retrying in ${delay}ms...`, lastError);
        
        if (lastError.retry_after) {
          await this.sleep(lastError.retry_after * 1000);
        } else {
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private parseError(error: unknown): OpenRouterError {
    const err = error as Record<string, any>;
    
    if (err?.status === 429) {
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded',
        retry_after: parseInt(err.headers?.['retry-after']) || 60
      };
    }

    if (err?.status === 402) {
      return {
        type: 'insufficient_quota',
        message: 'Insufficient quota or credits'
      };
    }

    if (err?.status === 503) {
      return {
        type: 'model_unavailable',
        message: 'Model temporarily unavailable',
        suggested_model: this.getSuggestedFallbackModel()
      };
    }

    if (err?.name === 'NetworkError' || err?.code === 'NETWORK_ERROR') {
      return {
        type: 'network',
        message: 'Network connection error'
      };
    }

    return {
      type: 'unknown',
      message: err?.message || 'Unknown error occurred'
    };
  }

  private shouldRetry(error: OpenRouterError, attempt: number): boolean {
    if (attempt >= this.retryConfig.max_attempts) return false;
    
    return error.type === 'rate_limit' || 
           error.type === 'model_unavailable' || 
           error.type === 'network';
  }

  // 2. DYNAMIC MODEL SELECTION
  selectOptimalModel(criteria: ModelSelectionCriteria): string {
    const availableModels = this.modelConfigs.filter(model => {
      // Filter by context length requirement
      if (model.context_length < criteria.context_length_needed) return false;
      
      // Filter by budget if specified
      if (criteria.budget_remaining && criteria.budget_remaining > 0) {
        const estimatedCost = model.cost_per_token * criteria.context_length_needed;
        if (estimatedCost > criteria.budget_remaining) return false;
      }
      
      // Filter by task type strengths
      if (!model.strengths.includes(criteria.task_type)) return false;
      
      return true;
    });

    if (availableModels.length === 0) {
      // Fallback to cheapest available model
      return this.getCheapestModel();
    }

    // Score models based on priority
    const scoredModels = availableModels.map(model => {
      let score = 0;
      
      switch (criteria.priority) {
        case 'speed':
          score = model.speed_score * 0.6 + model.quality_score * 0.3 + model.cost_score * 0.1;
          break;
        case 'quality':
          score = model.quality_score * 0.6 + model.speed_score * 0.2 + model.cost_score * 0.2;
          break;
        case 'cost':
          score = model.cost_score * 0.6 + model.speed_score * 0.2 + model.quality_score * 0.2;
          break;
      }

      // Complexity bonus
      if (criteria.complexity === 'high' && model.quality_score >= 8) score += 1;
      if (criteria.complexity === 'low' && model.speed_score >= 8) score += 1;

      return { model, score };
    });

    // Return highest scoring model
    scoredModels.sort((a, b) => b.score - a.score);
    return scoredModels[0].model.id;
  }

  // 3. COST TRACKING
  trackUsage(model: string, tokens: number, cost: number): void {
    this.costTracker.total_tokens += tokens;
    this.costTracker.total_cost += cost;
    this.costTracker.session_cost += cost;
    this.costTracker.requests_count += 1;

    if (!this.costTracker.cost_per_model[model]) {
      this.costTracker.cost_per_model[model] = 0;
    }
    this.costTracker.cost_per_model[model] += cost;

    this.saveCostTracker();
  }

  getCostTracker(): CostTracker {
    return { ...this.costTracker };
  }

  resetSessionCost(): void {
    this.costTracker.session_cost = 0;
  }

  setBudgetLimit(limit: number): void {
    this.costTracker.budget_limit = limit;
  }

  checkBudgetLimit(estimatedCost: number): boolean {
    if (!this.costTracker.budget_limit) return true;
    return (this.costTracker.session_cost + estimatedCost) <= this.costTracker.budget_limit;
  }

  // 4. RESPONSE CACHING
  generateCacheKey(prompt: string, model: string, agent?: string): string {
    const normalizedPrompt = prompt.toLowerCase().trim();
    return `${model}:${agent || 'auto'}:${this.hashString(normalizedPrompt)}`;
  }

  getCachedResponse(cacheKey: string): CacheEntry | null {
    const entry = this.cache.get(cacheKey);
    
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    // Update usage count
    entry.usage_count++;
    return entry;
  }

  setCachedResponse(
    cacheKey: string, 
    response: string, 
    agent: import('../types/council').CouncilAgent, 
    ttl: number = 3600000 // 1 hour default
  ): void {
    const entry: CacheEntry = {
      key: cacheKey,
      response,
      agent,
      timestamp: Date.now(),
      ttl,
      usage_count: 1
    };

    this.cache.set(cacheKey, entry);
    
    // Cleanup old entries if cache gets too large
    if (this.cache.size > 1000) {
      this.cleanupCache();
    }
  }

  private cleanupCache(): void {
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    const now = Date.now();
    entries.forEach(([key, entry]) => {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    });

    // If still too large, remove least used entries
    if (this.cache.size > 800) {
      const sortedEntries = entries
        .filter(([key]) => this.cache.has(key))
        .sort((a, b) => a[1].usage_count - b[1].usage_count);
      
      const toRemove = sortedEntries.slice(0, 200);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  // UTILITY METHODS
  private initializeModelConfigs(): ModelConfig[] {
    return [
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        cost_per_token: 0.000003,
        context_length: 200000,
        strengths: ['reasoning', 'analytical', 'conversational'],
        speed_score: 7,
        quality_score: 10,
        cost_score: 6
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        cost_per_token: 0.000005,
        context_length: 128000,
        strengths: ['creative', 'conversational', 'reasoning'],
        speed_score: 8,
        quality_score: 9,
        cost_score: 5
      },
      {
        id: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini',
        cost_per_token: 0.00000015,
        context_length: 128000,
        strengths: ['conversational', 'analytical'],
        speed_score: 9,
        quality_score: 7,
        cost_score: 10
      },
      {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        cost_per_token: 0.00000025,
        context_length: 200000,
        strengths: ['conversational', 'creative'],
        speed_score: 10,
        quality_score: 6,
        cost_score: 9
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        cost_per_token: 0.00000125,
        context_length: 1000000,
        strengths: ['reasoning', 'analytical', 'planning'],
        speed_score: 6,
        quality_score: 8,
        cost_score: 8
      },
      {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'Llama 3.1 8B (Free)',
        cost_per_token: 0,
        context_length: 128000,
        strengths: ['conversational'],
        speed_score: 8,
        quality_score: 5,
        cost_score: 10
      }
    ];
  }

  private getCheapestModel(): string {
    const cheapest = this.modelConfigs
      .sort((a, b) => a.cost_per_token - b.cost_per_token)[0];
    return cheapest.id;
  }

  private getSuggestedFallbackModel(): string {
    // Return a reliable, fast model as fallback
    return 'openai/gpt-4o-mini';
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private saveCostTracker(): void {
    try {
      localStorage.setItem('openrouter_cost_tracker', JSON.stringify(this.costTracker));
    } catch (error) {
      console.warn('Failed to save cost tracker:', error);
    }
  }

  private loadCostTracker(): void {
    try {
      const saved = localStorage.getItem('openrouter_cost_tracker');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.costTracker = { ...this.costTracker, ...parsed };
        // Reset session cost on load
        this.costTracker.session_cost = 0;
      }
    } catch (error) {
      console.warn('Failed to load cost tracker:', error);
    }
  }
}

// Singleton instance
export const openRouterOptimizer = new OpenRouterOptimizer();
