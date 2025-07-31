import { OpenRouterRequest, OpenRouterResponse, CouncilAgent, OpenRouterModel } from '../types/council';
import { COUNCIL_AGENTS } from '../config/councilAgents';
import { UserProfile } from '../engine/userProfile';

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCouncilResponse(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    selectedAgent?: CouncilAgent,
    model = 'anthropic/claude-3.5-sonnet'
  ): Promise<{ agent: CouncilAgent; content: string }> {
    
    const systemPrompt = this.buildSystemPrompt(userProfile, selectedAgent);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.slice(-10), // Last 10 messages for context
      { role: 'user' as const, content: userMessage }
    ];

    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Cosmic Echoes Guide - Council Chat'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content || 'Przepraszam, nie mogę teraz odpowiedzieć.';
      
      // Determine which agent should respond
      const respondingAgent = selectedAgent || this.selectBestAgent(userMessage, userProfile);
      
      return {
        agent: respondingAgent,
        content: this.formatAgentResponse(respondingAgent, content)
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Nie udało się połączyć z Radą Kosmiczną. Spróbuj ponownie.');
    }
  }

  private buildSystemPrompt(userProfile: UserProfile, selectedAgent?: CouncilAgent): string {
    const profileSummary = this.buildProfileSummary(userProfile);
    const currentEnergy = this.buildCurrentEnergyContext(userProfile);
    
    if (selectedAgent) {
      const agent = COUNCIL_AGENTS[selectedAgent];
      return `Jesteś ${agent.name}, członek Rady Kosmicznej. 

TWOJA ROLA:
${agent.description}

TWOJA PERSPEKTYWA:
${agent.perspective}

TWOJA SPECJALIZACJA:
${agent.specialization.join(', ')}

PROFIL UŻYTKOWNIKA:
${profileSummary}

AKTUALNA ENERGIA DNIA:
${currentEnergy}

INSTRUKCJE:
- Odpowiadaj zawsze jako ${agent.name}
- Używaj swojej unikalnej perspektywy i specjalizacji
- Nawiązuj do profilu użytkownika i aktualnej energii
- Bądź mądry, empatyczny i pomocny
- Używaj języka polskiego
- ${selectedAgent === 'echo' ? 'Nie dawaj rad - zadawaj pytania pomagające w refleksji' : 'Dawaj konkretne, praktyczne porady'}`;
    }

    return `Jesteś Radą Kosmiczną - zespołem sześciu mądrych agentów. Każdy ma unikalną perspektywę:

AGENCI RADY:
${Object.values(COUNCIL_AGENTS).map(agent => 
  `${agent.avatar} ${agent.name}: ${agent.perspective}`
).join('\n')}

PROFIL UŻYTKOWNIKA:
${profileSummary}

AKTUALNA ENERGIA DNIA:
${currentEnergy}

INSTRUKCJE:
- Wybierz najlepszego agenta do odpowiedzi na pytanie użytkownika
- Rozpocznij odpowiedź od: "[AVATAR] [NAZWA_AGENTA]:"
- Używaj perspektywy i specjalizacji wybranego agenta
- Nawiązuj do profilu użytkownika i aktualnej energii
- Bądź mądry, empatyczny i pomocny
- Używaj języka polskiego`;
  }

  private buildProfileSummary(profile: UserProfile): string {
    const { name, birthData, analysis } = profile;
    
    return `
Imię: ${name}
Data urodzenia: ${birthData.date}
${birthData.time ? `Godzina urodzenia: ${birthData.time}` : ''}
${birthData.place ? `Miejsce urodzenia: ${birthData.place}` : ''}

ASTROLOGIA:
- Znak słoneczny: ${analysis.astrology?.sunSign?.name || 'Nieznany'}
- Ascendent: ${analysis.astrology?.ascendant?.name || 'Nieznany'}

NUMEROLOGIA:
- Analiza numerologiczna dostępna

HUMAN DESIGN:
- Typ: ${analysis.humanDesign?.type || 'Nieznany'}
- Profil: ${analysis.humanDesign?.profile || 'Nieznany'}
- Autorytet: ${analysis.humanDesign?.authority || 'Nieznany'}

CHIŃSKI ZODIAK:
- Zwierzę: ${analysis.chineseZodiac?.animal || 'Nieznane'}
- Element: ${analysis.chineseZodiac?.element || 'Nieznany'}

KALENDARZ MAJÓW:
- Znak: ${analysis.mayan?.sign || 'Nieznany'}
- Ton: ${analysis.mayan?.tone || 'Nieznany'}`;
  }

  private buildCurrentEnergyContext(profile: UserProfile): string {
    const today = new Date();
    const biorhythms = this.calculateBiorhythms(profile.birthData.date, today);
    
    return `
BIORYTMY (${today.toLocaleDateString('pl-PL')}):
- Fizyczny: ${biorhythms.physical}%
- Emocjonalny: ${biorhythms.emotional}%
- Intelektualny: ${biorhythms.intellectual}%

ENERGIA MAJAŃSKA:
- Dzisiejszy znak: ${this.getTodayMayanSign()}
- Energia dnia: ${this.getTodayMayanEnergy()}`;
  }

  private calculateBiorhythms(birthDate: string, currentDate: Date) {
    const birth = new Date(birthDate);
    const daysDiff = Math.floor((currentDate.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      physical: Math.round(Math.sin(2 * Math.PI * daysDiff / 23) * 100),
      emotional: Math.round(Math.sin(2 * Math.PI * daysDiff / 28) * 100),
      intellectual: Math.round(Math.sin(2 * Math.PI * daysDiff / 33) * 100)
    };
  }

  private getTodayMayanSign(): string {
    // Simplified Mayan calendar calculation
    const signs = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc', 'Chuen', 'Eb', 'Ben', 'Ix', 'Men', 'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return signs[dayOfYear % 20];
  }

  private getTodayMayanEnergy(): string {
    const energies = ['Inicjacja', 'Wyzwanie', 'Służba', 'Forma', 'Promieniowanie', 'Równowaga', 'Kanalizacja', 'Harmonia', 'Intencja', 'Manifestacja', 'Uwolnienie', 'Współpraca', 'Obecność'];
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return energies[dayOfYear % 13];
  }

  private selectBestAgent(userMessage: string, profile: UserProfile): CouncilAgent {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based agent selection
    if (message.includes('plan') || message.includes('struktur') || message.includes('organizuj')) {
      return 'architect';
    }
    if (message.includes('przyszł') || message.includes('wizj') || message.includes('intuicj')) {
      return 'oracle';
    }
    if (message.includes('emocj') || message.includes('uczuci') || message.includes('relacj')) {
      return 'alchemist';
    }
    if (message.includes('działani') || message.includes('krok') || message.includes('energia')) {
      return 'pioneer';
    }
    if (message.includes('wzorz') || message.includes('przeszł') || message.includes('dlaczego')) {
      return 'chronicler';
    }
    if (message.includes('?') && message.split('?').length > 1) {
      return 'echo';
    }
    
    // Default to oracle for general questions
    return 'oracle';
  }

  private formatAgentResponse(agent: CouncilAgent, content: string): string {
    const agentConfig = COUNCIL_AGENTS[agent];
    
    // Remove agent prefix if AI already added it
    const cleanContent = content.replace(new RegExp(`^${agentConfig.avatar}\\s*${agentConfig.name}:\\s*`, 'i'), '');
    
    return `${agentConfig.avatar} **${agentConfig.name}**: ${cleanContent}`;
  }

  async getAvailableModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
}
