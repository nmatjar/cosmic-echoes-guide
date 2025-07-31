import React, { useState, useEffect, useRef } from 'react';
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
import { Loader2, Send, Settings, History, BarChart3, MessageSquare, Sparkles } from 'lucide-react';

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
  const [selectedAgent, setSelectedAgent] = useState<CouncilAgent | undefined>();
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [intention, setIntention] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const sessionMessages = await chatService.getSessionMessages(session.session_id);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const sendMessage = async () => {
    if (!chatService || !currentSession || !inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    try {
      const { userMessage: savedUserMsg, agentResponse } = await chatService.sendMessageToCouncil(
        currentSession.session_id,
        userMessage,
        userProfile,
        selectedAgent,
        selectedModel
      );

      setMessages(prev => [...prev, savedUserMsg, agentResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        message_id: `error-${Date.now()}`,
        session_id: currentSession.session_id,
        author: 'agent',
        content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!chatService || !currentSession) return;

    try {
      const summary = await chatService.generateSessionSummary(currentSession.session_id);
      await chatService.endSession(currentSession.session_id, summary);
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
        <div key={message.message_id} className="flex justify-end mb-4">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-[80%]">
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString('pl-PL')}
            </span>
          </div>
        </div>
      );
    }

    const agent = message.agent_id ? COUNCIL_AGENTS[message.agent_id] : null;
    
    return (
      <div key={message.message_id} className="flex justify-start mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
          {agent && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{agent.avatar}</span>
              <Badge variant="secondary" className="text-xs">
                {agent.name}
              </Badge>
            </div>
          )}
          <div 
            className="text-sm prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }}
          />
          <span className="text-xs opacity-70 mt-2 block">
            {new Date(message.timestamp).toLocaleTimeString('pl-PL')}
          </span>
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <Card>
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
                      <TabsTrigger value="agent">Agent</TabsTrigger>
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
                    <TabsContent value="agent" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Preferowany Agent</label>
                        <Select value={selectedAgent || 'auto'} onValueChange={(value) => 
                          setSelectedAgent(value === 'auto' ? undefined : value as CouncilAgent)
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Automatyczny wybór</SelectItem>
                            {Object.values(COUNCIL_AGENTS).map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.avatar} {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      {!currentSession ? (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Rozpocznij nową sesję z Radą Kosmiczną</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ustaw intencję dla swojej sesji (opcjonalnie)
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <Textarea
                placeholder="Np. 'Chcę zrozumieć mój cel życiowy' lub 'Potrzebuję wskazówek w relacjach'"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                rows={3}
              />
              <Button onClick={startNewSession} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Rozpocznij Sesję
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Sesja z Radą Kosmiczną</CardTitle>
                {currentSession.intention && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Intencja: {currentSession.intention}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={endSession}>
                Zakończ Sesję
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(formatMessage)}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Zadaj pytanie Radzie Kosmicznej..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agents Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Poznaj Radę Kosmiczną</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(COUNCIL_AGENTS).map((agent) => (
              <div key={agent.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{agent.avatar}</span>
                  <h4 className="font-semibold">{agent.name}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.description}
                </p>
                <p className="text-xs text-gray-500 italic">
                  "{agent.exampleQuestion}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
