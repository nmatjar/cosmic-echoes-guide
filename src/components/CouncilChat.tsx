import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CouncilChatService } from '../services/councilChatService';
import { ExpertService } from '../services/ExpertService';
import { COUNCIL_AGENTS } from '../config/councilAgents';
import { ChatSession, ChatMessage, CouncilAgent as CouncilAgentEnum } from '../types/council';
import { UserProfile } from '../engine/userProfile';
import { Expert } from '@/engine/types';
import { Loader2, Send, Settings, History, MessageSquare, Sparkles, Download, Trash2, UserCheck } from 'lucide-react';

// Unified type for displaying both Council Agents and Experts
type DisplayAgent = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  isExpert: boolean;
  meta_prompt?: string;
  // For tooltip info
  perspective?: string;
  exampleQuestion?: string;
};

interface CouncilChatProps {
  userProfile: UserProfile;
  userId: string;
}

const chatService = new CouncilChatService();

export const CouncilChat: React.FC<CouncilChatProps> = ({ userProfile, userId }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DisplayAgent | undefined>();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [intention, setIntention] = useState('');
  const [allDisplayAgents, setAllDisplayAgents] = useState<DisplayAgent[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAgents = async () => {
      // Map COUNCIL_AGENTS to DisplayAgent format
      const councilAgents: DisplayAgent[] = Object.values(COUNCIL_AGENTS).map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        avatar: agent.avatar,
        isExpert: false,
        perspective: agent.perspective,
        exampleQuestion: agent.exampleQuestion,
      }));

      // Fetch experts
      const fetchedExperts = await ExpertService.getActiveExperts();
      const expertAgents: DisplayAgent[] = fetchedExperts ? fetchedExperts.map(expert => ({
        id: expert.id,
        name: expert.name,
        description: expert.specialization.join(', '),
        avatar: '👤', // Default avatar for experts
        isExpert: true,
        meta_prompt: expert.meta_prompt,
        perspective: expert.bio,
        exampleQuestion: `Zapytaj mnie o ${expert.specialization[0] || 'moją specjalizację'}.`
      })) : [];

      setAllDisplayAgents([...councilAgents, ...expertAgents]);
    };

    initializeAgents();
    loadUserSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserSessions = async () => {
    const userSessions = await chatService.getUserSessions(userId);
    setSessions(userSessions);
  };

  const startNewSession = async () => {
    const session = await chatService.createSession(userId, intention || undefined);
    setCurrentSession(session);
    setMessages([{
      message_id: 'welcome',
      session_id: session.session_id,
      author: 'agent',
      content: '🌟 **Rada Kosmiczna**: Witaj. O czym chciałbyś porozmawiać?',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    }]);
    await loadUserSessions();
  };

  const loadSession = async (session: ChatSession) => {
    setCurrentSession(session);
    const sessionMessages = await chatService.getSessionMessages(session.session_id, userId);
    setMessages(sessionMessages);
  };

  const sendMessage = async () => {
    if (!currentSession || !inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setIsStreaming(true);
    const userMessageContent = inputMessage;
    setInputMessage('');

    setMessages(prev => [...prev, {
      message_id: `user-${Date.now()}`,
      session_id: currentSession.session_id,
      author: 'user',
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    }]);

    const streamingPlaceholderId = `streaming-${Date.now()}`;

    try {
      await chatService.sendMessageToCouncil(
        currentSession.session_id,
        userMessageContent,
        userProfile,
        selectedAgent?.isExpert ? undefined : selectedAgent?.id as CouncilAgentEnum, // Pass CouncilAgentEnum only if not an expert
        selectedAgent?.isExpert ? selectedAgent.meta_prompt : undefined, // Pass meta_prompt if it is an expert
        userId,
        (chunk: string) => {
          setMessages(prev => {
            const existingMsgIndex = prev.findIndex(msg => msg.message_id === streamingPlaceholderId);
            if (existingMsgIndex !== -1) {
              const updated = [...prev];
              updated[existingMsgIndex].content += chunk;
              return updated;
            } else {
              return [...prev, {
                message_id: streamingPlaceholderId,
                session_id: currentSession.session_id,
                author: 'agent',
                content: chunk,
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString(),
              }];
            }
          });
        }
      );
      const finalMessages = await chatService.getSessionMessages(currentSession.session_id, userId);
      setMessages(finalMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev.filter(m => m.message_id !== streamingPlaceholderId), {
        message_id: `error-${Date.now()}`,
        session_id: currentSession.session_id,
        author: 'agent',
        content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;
    const summary = await chatService.generateSessionSummary(currentSession.session_id, userId);
    await chatService.endSession(currentSession.session_id, summary, userId);
    setCurrentSession(null);
    setMessages([]);
    await loadUserSessions();
  };

  const formatMessage = (message: ChatMessage) => {
    // ... (formatting logic remains largely the same, but we need to find the agent from the new unified list)
    const agent = message.agent_id ? allDisplayAgents.find(a => a.id === message.agent_id) : null;
    
    if (message.author === 'user') {
      return (
        <div key={message.message_id} className="flex justify-end mb-6">
          <div className="relative max-w-[80%]">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={message.message_id} className="flex justify-start mb-6">
        <div className="relative max-w-[80%]">
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-6 py-4 shadow-xl">
            {agent && (
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-purple-500/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl border border-purple-400/30">
                  {agent.avatar}
                </div>
                <div>
                  <Badge variant="secondary" className={`${agent.isExpert ? 'bg-green-500/20 text-green-200 border-green-400/30' : 'bg-purple-500/20 text-purple-200 border-purple-400/30'} text-xs font-medium`}>
                    {agent.isExpert && <UserCheck className="h-3 w-3 mr-1" />}
                    {agent.name}
                  </Badge>
                  <p className="text-xs text-purple-300/70 mt-1 line-clamp-1">{agent.description}</p>
                </div>
              </div>
            )}
            <div 
              className="text-sm leading-relaxed text-gray-100 prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-200 font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Card with Settings/History */}
        <Card className="mb-4">
          {/* ... Header content remains the same */}
        </Card>

        <div className="flex gap-4 h-[700px]">
          {/* Agent Selection Sidebar */}
          <Card className="w-96 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Wybierz Rozmówcę</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Porozmawiaj z Radą lub zewnętrznym ekspertem.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[580px] px-4">
                <div className="space-y-2 pb-4">
                  {/* Automatic Selection Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedAgent === undefined ? "default" : "outline"}
                        className={`w-full justify-start h-auto p-3 ${selectedAgent === undefined ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}`}
                        onClick={() => setSelectedAgent(undefined)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl border border-purple-400/30">✨</div>
                          <div className="text-left">
                            <div className="font-medium">Automatyczny wybór</div>
                            <div className="text-xs opacity-80">Rada wybierze najlepszego agenta</div>
                          </div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Pozwól Radzie Kosmicznej wybrać najlepszego eksperta do Twojego pytania.</p></TooltipContent>
                  </Tooltip>

                  {/* Combined Agent and Expert List */}
                  {allDisplayAgents.map((agent) => (
                    <Tooltip key={agent.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                          className={`w-full justify-start h-auto p-3 ${selectedAgent?.id === agent.id ? (agent.isExpert ? "bg-gradient-to-r from-green-500 to-teal-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white") : ""}`}
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border ${agent.isExpert ? 'border-green-400/30' : 'border-purple-400/30'}`}>
                              {agent.avatar}
                            </div>
                            <div className="text-left">
                              <div className="font-medium flex items-center gap-2">{agent.name} {agent.isExpert && <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 h-5">Ekspert</Badge>}</div>
                              <div className="text-xs opacity-80 line-clamp-2">{agent.description}</div>
                            </div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-bold">{agent.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agent.perspective}</p>
                        <p className="text-xs italic mt-2">"{agent.exampleQuestion}"</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <div className="flex-1">
            {!currentSession ? (
              // Start Session View
              <Card className="h-full flex flex-col items-center justify-center">
                <CardContent className="p-8 text-center space-y-6">
                  <h3 className="text-xl font-semibold">Rozpocznij nową sesję</h3>
                  <Textarea
                    placeholder="Opcjonalnie: ustaw intencję dla sesji..."
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={startNewSession} className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Rozpocznij
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Active Chat View
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Sesja z Radą</CardTitle>
                      {currentSession.intention && <p className="text-sm text-gray-500">Intencja: {currentSession.intention}</p>}
                    </div>
                    <Button variant="outline" size="sm" onClick={endSession}>Zakończ Sesję</Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(formatMessage)}
                      {isLoading && !isStreaming && <div className="text-center text-gray-500">Rada myśli...</div>}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Zadaj pytanie..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        disabled={isLoading}
                      />
                      <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
