import { ChatSession, ChatMessage, CouncilAgent } from '../types/council';
import { OpenRouterService } from './openRouterService';
import { UserProfile } from '../engine/userProfile';

export class CouncilChatService {
  private openRouterService: OpenRouterService;
  private readonly STORAGE_KEY_SESSIONS = 'cosmic_council_sessions';
  private readonly STORAGE_KEY_MESSAGES = 'cosmic_council_messages';

  constructor() {
    this.openRouterService = new OpenRouterService();
  }

  // ... (local storage helpers remain the same)
  private getSessions(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(this.STORAGE_KEY_SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error);
      return [];
    }
  }

  private saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions to localStorage:', error);
    }
  }

  private getMessages(): ChatMessage[] {
    try {
      const messages = localStorage.getItem(this.STORAGE_KEY_MESSAGES);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
      return [];
    }
  }

  private saveMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }


  // Session management
  async createSession(userId: string, intention?: string): Promise<ChatSession> {
    const sessionId = this.generateId();
    const now = new Date().toISOString();
    
    const session: ChatSession = {
      session_id: sessionId,
      user_id: userId,
      start_time: now,
      end_time: null,
      intention: intention || null,
      summary: null,
      created_at: now,
      updated_at: now
    };

    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);

    return session;
  }

  async endSession(sessionId: string, summary?: string, userId?: string): Promise<void> {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.session_id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].end_time = new Date().toISOString();
      sessions[sessionIndex].summary = summary || null;
      sessions[sessionIndex].updated_at = new Date().toISOString();
      this.saveSessions(sessions);
    }
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const sessions = this.getSessions();
    return sessions
      .filter(session => session.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Message management
  async addMessage(
    sessionId: string,
    content: string,
    author: 'user' | 'agent',
    agentId?: CouncilAgent,
    userId?: string
  ): Promise<ChatMessage> {
    const messageId = this.generateId();
    const now = new Date().toISOString();

    const message: ChatMessage = {
      message_id: messageId,
      session_id: sessionId,
      agent_id: agentId || null,
      author,
      content,
      timestamp: now,
      created_at: now
    };

    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);

    return message;
  }

  async getSessionMessages(sessionId: string, userId?: string): Promise<ChatMessage[]> {
    const messages = this.getMessages();
    return messages
      .filter(message => message.session_id === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // AI Integration
  async sendMessageToCouncil(
    sessionId: string,
    userMessage: string,
    userProfile: UserProfile,
    selectedAgent?: CouncilAgent,
    metaPrompt?: string, // New parameter for expert's meta_prompt
    model?: string,
    userId?: string,
    onStreamChunk?: (chunk: string) => void
  ): Promise<{ userMessage: ChatMessage; agentResponse: ChatMessage }> {
    
    // Save user message
    const userMsg = await this.addMessage(sessionId, userMessage, 'user', undefined, userId);

    try {
      // Get chat history for context
      const messages = await this.getSessionMessages(sessionId, userId);
      const chatHistory = messages
        .slice(-10) // Last 10 messages
        .map(msg => ({
          role: msg.author === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Generate AI response with streaming if callback provided
      const { agent, content } = onStreamChunk 
        ? await this.openRouterService.generateCouncilResponseStream(
            userMessage,
            userProfile,
            chatHistory,
            selectedAgent,
            metaPrompt, // Pass meta_prompt to the service
            model,
            onStreamChunk
          )
        : await this.openRouterService.generateCouncilResponse(
            userMessage,
            userProfile,
            chatHistory,
            selectedAgent,
            metaPrompt, // Pass meta_prompt to the service
            model
          );
      
      // The new logic will parse the agent from the response content
      let finalAgent = agent;
      let finalContent = content;

      if (content.startsWith('agent:')) {
        const parts = content.split('\n');
        const agentLine = parts.shift() || '';
        finalAgent = agentLine.replace('agent:', '').trim() as CouncilAgent;
        finalContent = parts.join('\n');
      }

      // Save agent response
      const agentMsg = await this.addMessage(sessionId, finalContent, 'agent', finalAgent, userId);

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
        'agent',
        undefined,
        userId
      );

      return {
        userMessage: userMsg,
        agentResponse: errorMsg
      };
    }
  }

  // ... (Analytics and other methods remain the same)
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
      const messages = await this.getSessionMessages(session.session_id, userId);
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
          const end = new Date(session.end_time!);;
          return sum + (end.getTime() - start.getTime());
        }, 0) / completedSessions.length / (1000 * 60) // Convert to minutes
      : 0;

    return {
      totalSessions: sessions.length,
      totalMessages: allMessages.length,
      averageSessionLength: Math.round(averageSessionLength),
      mostActiveAgent,
      commonTopics: this.extractTopics(allMessages)
    };
  }

  async generateSessionSummary(sessionId: string, userId?: string): Promise<string> {
    const messages = await this.getSessionMessages(sessionId, userId);
    
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

  // Data management
  async exportChatData(userId: string): Promise<{
    sessions: ChatSession[];
    messages: ChatMessage[];
  }> {
    const sessions = await this.getUserSessions(userId);
    const allMessages: ChatMessage[] = [];
    
    for (const session of sessions) {
      const messages = await this.getSessionMessages(session.session_id, userId);
      allMessages.push(...messages);
    }

    return {
      sessions,
      messages: allMessages
    };
  }

  async clearChatData(userId: string): Promise<void> {
    const sessions = this.getSessions();
    const messages = this.getMessages();

    // Remove user's sessions and messages
    const filteredSessions = sessions.filter(s => s.user_id !== userId);
    const userSessionIds = sessions
      .filter(s => s.user_id === userId)
      .map(s => s.session_id);
    const filteredMessages = messages.filter(m => !userSessionIds.includes(m.session_id));

    this.saveSessions(filteredSessions);
    this.saveMessages(filteredMessages);
  }
}
