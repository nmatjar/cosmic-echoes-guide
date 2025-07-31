import { supabase } from '../integrations/supabase/client';
import { ChatSession, ChatMessage, CouncilAgent } from '../types/council';
import { OpenRouterService } from './openRouterService';
import { UserProfile } from '../engine/userProfile';

export class CouncilChatService {
  private openRouterService: OpenRouterService | null = null;

  constructor(openRouterApiKey?: string) {
    if (openRouterApiKey) {
      this.openRouterService = new OpenRouterService(openRouterApiKey);
    }
  }

  // Session management
  async createSession(userId: string, intention?: string): Promise<ChatSession> {
    const sessionData = {
      user_id: userId,
      start_time: new Date().toISOString(),
      intention: intention || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('chat_sessions' as any)
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create chat session: ${error.message}`);
    }

    const session = data as any;
    return {
      session_id: session.session_id,
      user_id: session.user_id,
      start_time: session.start_time,
      end_time: session.end_time,
      intention: session.intention,
      summary: session.summary,
      created_at: session.created_at,
      updated_at: session.updated_at
    };
  }

  async endSession(sessionId: string, summary?: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions' as any)
      .update({
        end_time: new Date().toISOString(),
        summary: summary || null,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) {
      throw new Error(`Failed to end chat session: ${error.message}`);
    }
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user sessions: ${error.message}`);
    }

    return data.map((session: any) => ({
      session_id: session.session_id,
      user_id: session.user_id,
      start_time: session.start_time,
      end_time: session.end_time,
      intention: session.intention,
      summary: session.summary,
      created_at: session.created_at,
      updated_at: session.updated_at
    }));
  }

  // Message management
  async addMessage(
    sessionId: string,
    content: string,
    author: 'user' | 'agent',
    agentId?: CouncilAgent
  ): Promise<ChatMessage> {
    const messageData = {
      session_id: sessionId,
      agent_id: agentId || null,
      author,
      content,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('chat_messages' as any)
      .insert(messageData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    const message = data as any;
    return {
      message_id: message.message_id,
      session_id: message.session_id,
      agent_id: message.agent_id,
      author: message.author,
      content: message.content,
      timestamp: message.timestamp,
      created_at: message.created_at
    };
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages' as any)
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch session messages: ${error.message}`);
    }

    return data.map((message: any) => ({
      message_id: message.message_id,
      session_id: message.session_id,
      agent_id: message.agent_id,
      author: message.author,
      content: message.content,
      timestamp: message.timestamp,
      created_at: message.created_at
    }));
  }

  // AI Integration
  async sendMessageToCouncil(
    sessionId: string,
    userMessage: string,
    userProfile: UserProfile,
    selectedAgent?: CouncilAgent,
    model?: string
  ): Promise<{ userMessage: ChatMessage; agentResponse: ChatMessage }> {
    if (!this.openRouterService) {
      throw new Error('OpenRouter API key not configured');
    }

    // Save user message
    const userMsg = await this.addMessage(sessionId, userMessage, 'user');

    try {
      // Get chat history for context
      const messages = await this.getSessionMessages(sessionId);
      const chatHistory = messages
        .slice(-10) // Last 10 messages
        .map(msg => ({
          role: msg.author === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Generate AI response
      const { agent, content } = await this.openRouterService.generateCouncilResponse(
        userMessage,
        userProfile,
        chatHistory,
        selectedAgent,
        model
      );

      // Save agent response
      const agentMsg = await this.addMessage(sessionId, content, 'agent', agent);

      return {
        userMessage: userMsg,
        agentResponse: agentMsg
      };
    } catch (error) {
      console.error('Error generating council response:', error);
      
      // Save error message
      const errorMsg = await this.addMessage(
        sessionId,
        'Przepraszam, wystąpił błąd podczas łączenia z Radą Kosmiczną. Spróbuj ponownie.',
        'agent'
      );

      return {
        userMessage: userMsg,
        agentResponse: errorMsg
      };
    }
  }

  // Analytics and insights
  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    totalMessages: number;
    averageSessionLength: number;
    mostActiveAgent: CouncilAgent | null;
    commonTopics: string[];
  }> {
    const sessions = await this.getUserSessions(userId);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalMessages: 0,
        averageSessionLength: 0,
        mostActiveAgent: null,
        commonTopics: []
      };
    }

    // Get all messages for user sessions
    const allMessages: ChatMessage[] = [];
    for (const session of sessions) {
      const messages = await this.getSessionMessages(session.session_id);
      allMessages.push(...messages);
    }

    // Calculate stats
    const agentCounts: Record<string, number> = {};
    allMessages
      .filter(msg => msg.author === 'agent' && msg.agent_id)
      .forEach(msg => {
        if (msg.agent_id) {
          agentCounts[msg.agent_id] = (agentCounts[msg.agent_id] || 0) + 1;
        }
      });

    const mostActiveAgent = Object.keys(agentCounts).length > 0
      ? Object.keys(agentCounts).reduce((a, b) => agentCounts[a] > agentCounts[b] ? a : b) as CouncilAgent
      : null;

    const completedSessions = sessions.filter(s => s.end_time);
    const averageSessionLength = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => {
          const start = new Date(session.start_time);
          const end = new Date(session.end_time!);
          return sum + (end.getTime() - start.getTime());
        }, 0) / completedSessions.length / (1000 * 60) // Convert to minutes
      : 0;

    return {
      totalSessions: sessions.length,
      totalMessages: allMessages.length,
      averageSessionLength: Math.round(averageSessionLength),
      mostActiveAgent,
      commonTopics: [] // TODO: Implement topic extraction
    };
  }

  async generateSessionSummary(sessionId: string): Promise<string> {
    const messages = await this.getSessionMessages(sessionId);
    
    if (messages.length === 0) {
      return 'Brak wiadomości w tej sesji.';
    }

    const userMessages = messages.filter(m => m.author === 'user');
    const agentMessages = messages.filter(m => m.author === 'agent');
    
    const uniqueAgents = [...new Set(agentMessages.map(m => m.agent_id).filter(Boolean))];
    
    return `Sesja zawierała ${userMessages.length} pytań użytkownika i ${agentMessages.length} odpowiedzi. ` +
           `Uczestniczyli agenci: ${uniqueAgents.join(', ')}. ` +
           `Główne tematy: ${this.extractTopics(messages).join(', ')}.`;
  }

  private extractTopics(messages: ChatMessage[]): string[] {
    // Simple keyword extraction - could be enhanced with NLP
    const keywords = ['miłość', 'praca', 'zdrowie', 'rodzina', 'finanse', 'rozwój', 'duchowość', 'relacje'];
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    return keywords.filter(keyword => content.includes(keyword));
  }

  // Utility methods
  isConfigured(): boolean {
    return this.openRouterService !== null;
  }

  updateApiKey(apiKey: string): void {
    this.openRouterService = new OpenRouterService(apiKey);
  }
}
