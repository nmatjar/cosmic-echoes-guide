import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CouncilChatService } from '../services/councilChatService';
import { COUNCIL_AGENTS, OPENROUTER_MODELS } from '../config/councilAgents';
import { ChatSession, ChatMessage, CouncilAgent } from '../types/council';
import { UserProfile } from '../engine/userProfile';
import { Loader2, Send, Settings, History, BarChart3, MessageSquare, Sparkles, Download, Trash2, Lock } from 'lucide-react';

interface CouncilChatProps {
  userProfile: UserProfile;
  userId: string;
}

export const CouncilChat: React.FC<CouncilChatProps> = ({ userProfile, userId }) => {
  const [chatService, setChatService] = useState<CouncilChatService | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CouncilAgent | undefined>();
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [intention, setIntention] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFreePlan = userProfile.subscriptionPlan === 'free';

  const availableModels = useMemo(() => {
    if (isFreePlan) {
      // Allow only specific free models for free plan users
      return OPENROUTER_MODELS.filter(model => model.id.includes(':free') || model.id === 'google/gemini-2.5-flash-lite');
    } else {
      return OPENROUTER_MODELS;
    }
  }, [isFreePlan]);

  useEffect(() => {
    // Check for saved API key
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      initializeChatService(savedApiKey);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatService = (key: string) => {
    const service = new CouncilChatService(key);
    setChatService(service);
    setIsConfigured(true);
    loadUserSessions(service);
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) return;
    
    localStorage.setItem('openrouter_api_key', apiKey);
    initializeChatService(apiKey);
  };

  const loadUserSessions = async (service: CouncilChatService) => {
    try {
      const userSessions = await service.getUserSessions(userId);
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const startNewSession = async () => {
    if (!chatService) return;

    try {
      const session = await chatService.createSession(userId, intention || undefined);
      setCurrentSession(session);
      setMessages([]);
      setIntention('');
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        message_id: 'welcome',
        session_id: session.session_id,
        author: 'agent',
        content: '🌟 **Rada Kosmiczna**: Witaj w przestrzeni mądrości kosmicznej. Jestem gotowa wysłuchać Twojego pytania i połączyć Cię z odpowiednim przewodnikiem. O czym chciałbyś porozmawiać?',
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      
      await loadUserSessions(chatService);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const loadSession = async (session: ChatSession) => {
    if (!chatService) return;

    try {
      setCurrentSession(session);
      const sessionMessages = await chatService.getSessionMessages(session.session_id, userId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const sendMessage = async () => {
    if (!chatService || !currentSession || !inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');
    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message immediately
    const userMsg: ChatMessage = {
      message_id: `user-${Date.now()}`,
      session_id: currentSession.session_id,
      author: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    // Create placeholder for streaming agent response
    const streamingPlaceholder: ChatMessage = {
      message_id: `streaming-${Date.now()}`,
      session_id: currentSession.session_id,
      author: 'agent',
      content: '',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    try {
      const { userMessage: savedUserMsg, agentResponse } = await chatService.sendMessageToCouncil(
        currentSession.session_id,
        userMessage,
        userProfile,
        selectedAgent,
        selectedModel,
        userId,
        (chunk: string) => {
          // Handle streaming chunks - accumulate text
          setStreamingMessage(prev => {
            const newContent = prev + chunk;
            // Update the placeholder message in real-time with accumulated content
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              if (lastMessage && lastMessage.message_id === streamingPlaceholder.message_id) {
                lastMessage.content = newContent;
              } else {
                // Add streaming placeholder if not exists
                updatedMessages.push({
                  ...streamingPlaceholder,
                  content: newContent
                });
              }
              return updatedMessages;
            });
            return newContent;
          });
        }
      );

      // Replace streaming placeholder with final response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.message_id !== streamingPlaceholder.message_id);
        return [...filtered.slice(0, -1), savedUserMsg, agentResponse]; // Remove temp user msg, add real ones
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove streaming placeholder and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.message_id !== streamingPlaceholder.message_id);
        const errorMessage: ChatMessage = {
          message_id: `error-${Date.now()}`,
          session_id: currentSession.session_id,
          author: 'agent',
          content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  const endSession = async () => {
    if (!chatService || !currentSession) return;

    try {
      const summary = await chatService.generateSessionSummary(currentSession.session_id, userId);
      await chatService.endSession(currentSession.session_id, summary, userId);
      setCurrentSession(null);
      setMessages([]);
      await loadUserSessions(chatService);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const formatMessage = (message: ChatMessage) => {
    if (message.author === 'user') {
      return (
        <div key={message.message_id} className="flex justify-end mb-6">
          <div className="relative max-w-[80%]">
            {/* Cosmic glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl blur-sm"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  🧙‍♂️
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-80 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString('pl-PL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const agent = message.agent_id ? COUNCIL_AGENTS[message.agent_id] : null;
    
    return (
      <div key={message.message_id} className="flex justify-start mb-6">
        <div className="relative max-w-[80%]">
          {/* Mystical glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl blur-sm"></div>
          <div className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-6 py-4 shadow-xl">
            {agent && (
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-purple-500/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl border border-purple-400/30">
                  {agent.avatar}
                </div>
                <div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs font-medium">
                    {agent.name}
                  </Badge>
                  <p className="text-xs text-purple-300/70 mt-1">{agent.description}</p>
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
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-purple-500/10">
              <span className="text-xs text-purple-300/60">
                {new Date(message.timestamp).toLocaleTimeString('pl-PL')}
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-purple-400/40 animate-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-pink-400/40 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 rounded-full bg-blue-400/40 animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isConfigured) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Konfiguracja Rady Kosmicznej
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aby korzystać z Rady Kosmicznej, potrzebujesz klucza API OpenRouter. 
            Możesz go uzyskać na <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openrouter.ai</a>
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Klucz API OpenRouter</label>
            <Input
              type="password"
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
          </div>
          <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
            Połącz z Radą Kosmiczną
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Rada Kosmiczna
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Historia Sesji</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <Card key={session.session_id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => {
                          loadSession(session);
                          setShowHistory(false);
                        }}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">
                                  {session.intention || 'Sesja bez tematu'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(session.start_time).toLocaleString('pl-PL')}
                                </p>
                              </div>
                              {session.end_time && (
                                <Badge variant="secondary" className="text-xs">
                                  Zakończona
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ustawienia Rady</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="model">
                    <TabsList>
                      <TabsTrigger value="model">Model AI</TabsTrigger>
                      <TabsTrigger value="data">Dane</TabsTrigger>
                    </TabsList>
                    <TabsContent value="model" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Model AI</label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPENROUTER_MODELS.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    <TabsContent value="data" className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Zarządzanie danymi</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            Twoje czaty są zapisywane lokalnie w przeglądarce
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={async () => {
                            if (!chatService) return;
                            try {
                              const data = await chatService.exportChatData(userId);
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `cosmic-council-chat-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Failed to export data:', error);
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Eksportuj czaty
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={async () => {
                            if (!chatService) return;
                            if (confirm('Czy na pewno chcesz usunąć wszystkie swoje czaty? Ta operacja jest nieodwracalna.')) {
                              try {
                                await chatService.clearChatData(userId);
                                setSessions([]);
                                setCurrentSession(null);
                                setMessages([]);
                                alert('Wszystkie czaty zostały usunięte.');
                              } catch (error) {
                                console.error('Failed to clear data:', error);
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Usuń wszystkie czaty
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Chat Layout */}
      <div className="flex gap-4 h-[700px]">
        {/* Left Sidebar - Agents */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rada Kosmiczna</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Wybierz przewodnika lub pozwól na automatyczny wybór
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[580px] px-4">
              <div className="space-y-2 pb-4">
                {/* Auto selection */}
                <Button
                  variant={selectedAgent === undefined ? "default" : "outline"}
                  className={`w-full justify-start h-auto p-3 ${
                    selectedAgent === undefined 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                      : ""
                  }`}
                  onClick={() => setSelectedAgent(undefined)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl border border-purple-400/30">
                      ✨
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Automatyczny wybór</div>
                      <div className="text-xs opacity-80">Rada wybierze najlepszego agenta</div>
                    </div>
                  </Button>

                {/* Individual agents */}
                {Object.values(COUNCIL_AGENTS).map((agent) => (
                  <Button
                    key={agent.id}
                    variant={selectedAgent === agent.id ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-3 ${
                      selectedAgent === agent.id 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : ""
                    }`}
                    onClick={() => setSelectedAgent(agent.id as CouncilAgent)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl border border-purple-400/30">
                        {agent.avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs opacity-80 line-clamp-2">{agent.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Center - Chat Area */}
        <div className="flex-1">
          {/* Chat Area */}
          {!currentSession ? (
        <Card className="relative overflow-hidden">
          {/* Mystical background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]"></div>
          
          <CardContent className="relative p-8 text-center space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rozpocznij nową sesję z Radą Kosmiczną
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ustaw intencję dla swojej sesji i pozwól kosmicznej mądrości Cię poprowadzić
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <Textarea
                placeholder="Np. 'Chcę zrozumieć mój cel życiowy' lub 'Potrzebuję wskazówek w relacjach'"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                rows={3}
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200/50 dark:border-purple-700/50"
              />
              <Button 
                onClick={startNewSession} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Rozpocznij Sesję
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[600px] flex flex-col relative overflow-hidden">
          {/* Mystical chat background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-gray-900/95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_70%)]"></div>
          
          <CardHeader className="relative flex-shrink-0 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Sesja z Radą Kosmiczną
                </CardTitle>
                {currentSession.intention && (
                  <p className="text-sm text-purple-300/70 mt-1">
                    Intencja: {currentSession.intention}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={endSession}
                className="border-purple-400/30 text-purple-300 hover:bg-purple-500/20"
              >
                Zakończ Sesję
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative flex-1 flex flex-col p-0">
            <div 
              className="flex-1 overflow-y-auto p-4" 
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                maxHeight: 'calc(600px - 120px)' // Subtract header and input heights
              }}
            >
              <div className="space-y-4">
                {messages.map(formatMessage)}
                {isLoading && (
                  <div className="flex justify-start mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl blur-sm"></div>
                      <div className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                          <span className="text-sm text-purple-300">Rada Kosmiczna myśli...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="relative border-t border-purple-500/20 p-4 flex-shrink-0 bg-gradient-to-r from-gray-900/50 to-purple-900/30 backdrop-blur-sm">
              <div className="flex gap-3">
                <Input
                  placeholder="Zadaj pytanie Radzie Kosmicznej..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 dark:bg-gray-900/50 border-purple-400/30 text-gray-100 placeholder:text-purple-300/60 focus:border-purple-400/60"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </div>

        {/* Right Sidebar - Agents Info */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Poznaj Radę</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Każdy agent ma swoją specjalizację
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[580px] px-4">
              <div className="space-y-3 pb-4">
                {Object.values(COUNCIL_AGENTS).map((agent) => (
                  <div key={agent.id} className="p-3 border rounded-lg space-y-2 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{agent.avatar}</span>
                      <h4 className="font-semibold text-sm">{agent.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {agent.description}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      "{agent.exampleQuestion}"
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
