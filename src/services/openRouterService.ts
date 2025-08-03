import { supabase } from '../integrations/supabase/client';
import { 
  OpenRouterRequest, 
  OpenRouterResponse, 
  CouncilAgent, 
  OpenRouterModel,
  EnhancedOpenRouterRequest,
  ModelSelectionCriteria,
  StreamingResponse,
  OpenRouterStreamChunk
} from '../types/council';
import { COUNCIL_AGENTS } from '../config/councilAgents';
import { UserProfile } from '../engine/userProfile';
import { openRouterOptimizer } from './openRouterOptimizer';

export class OpenRouterService {
  // API key is no longer needed here, it's handled by the Supabase Edge Function

  constructor() {
    // No API key needed in constructor
  }

  private async invokeProxy(
    request: OpenRouterRequest & { stream: boolean }
  ): Promise<Response> {
    const { data, error } = await supabase.functions.invoke('council-proxy', {
      body: { openRouterRequest: request },
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }
    
    // The response from supabase.functions.invoke is already a Response object
    // when dealing with streams, or can be treated as one.
    return data;
  }

  async generateCouncilResponseStream(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    selectedAgent?: CouncilAgent,
    metaPrompt?: string, // New parameter for expert's meta_prompt
    model?: string,
    onChunk?: (chunk: string) => void
  ): Promise<{ agent: CouncilAgent; content: string }> {
    
    let systemPrompt: string;
    let respondingAgent: CouncilAgent | 'expert' = 'expert';

    if (metaPrompt) {
      // If an expert's meta_prompt is provided, use it directly.
      systemPrompt = metaPrompt;
      // We can assign a generic 'expert' ID or the expert's actual ID if needed later
    } else {
      // Otherwise, use the existing council logic
      respondingAgent = selectedAgent || this.selectBestAgent(userMessage, userProfile);
      systemPrompt = this.buildSystemPrompt(userProfile, respondingAgent);
    }
    
    if (!model) {
      const criteria: ModelSelectionCriteria = {
        task_type: this.getTaskType(userMessage, respondingAgent as CouncilAgent),
        complexity: this.getComplexity(userMessage),
        priority: 'quality',
        context_length_needed: this.estimateContextLength(userMessage, chatHistory)
      };
      model = openRouterOptimizer.selectOptimalModel(criteria);
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.slice(-10),
      { role: 'user' as const, content: userMessage }
    ];

    const request: OpenRouterRequest & { stream: boolean } = {
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9,
      stream: true
    };

    try {
      const response = await this.invokeProxy(request);

      if (!response.ok) {
        throw new Error(`OpenRouter API error via proxy: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  onChunk?.(content);
                }
              } catch (e) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        agent: respondingAgent as CouncilAgent, // Casting for now, might need adjustment
        content: fullContent
      };
    } catch (error) {
      console.error('OpenRouter streaming error via proxy:', error);
      throw new Error('Nie udało się połączyć z Radą Kosmiczną. Spróbuj ponownie.');
    }
  }

  async generateCouncilResponse(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    selectedAgent?: CouncilAgent,
    metaPrompt?: string, // New parameter for expert's meta_prompt
    model?: string
  ): Promise<{ agent: CouncilAgent; content: string }> {
    
    let systemPrompt: string;
    let respondingAgent: CouncilAgent | 'expert' = 'expert';

    if (metaPrompt) {
      systemPrompt = metaPrompt;
    } else {
      respondingAgent = selectedAgent || this.selectBestAgent(userMessage, userProfile);
      systemPrompt = this.buildSystemPrompt(userProfile, respondingAgent);
    }
    
    if (!model) {
      const criteria: ModelSelectionCriteria = {
        task_type: this.getTaskType(userMessage, respondingAgent as CouncilAgent),
        complexity: this.getComplexity(userMessage),
        priority: 'quality',
        context_length_needed: this.estimateContextLength(userMessage, chatHistory)
      };
      model = openRouterOptimizer.selectOptimalModel(criteria);
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.slice(-10),
      { role: 'user' as const, content: userMessage }
    ];

    const request: OpenRouterRequest & { stream: boolean } = {
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    };

    try {
      const response = await this.invokeProxy(request);

      if (!response.ok) {
        throw new Error(`OpenRouter API error via proxy: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content || 'Przepraszam, nie mogę teraz odpowiedzieć.';
      
      return {
        agent: respondingAgent as CouncilAgent, // Casting for now
        content: content
      };
    } catch (error) {
      console.error('OpenRouter API error via proxy:', error);
      throw new Error('Nie udało się połączyć z Radą Kosmiczną. Spróbuj ponownie.');
    }
  }
  
  // ... (rest of the utility methods like buildSystemPrompt, selectBestAgent etc. remain the same)
  // ... (I will keep them in the final file but omit for brevity here)
  private buildSystemPrompt(userProfile: UserProfile, selectedAgent: CouncilAgent): string {
    const profileSummary = this.buildProfileSummary(userProfile);
    const currentEnergy = this.buildCurrentEnergyContext(userProfile);
    const agent = COUNCIL_AGENTS[selectedAgent];
    
    const basePrompt = `Jesteś ${agent.name}, członek Rady Kosmicznej. Twoim zadaniem jest odpowiadanie na pytania użytkownika, korzystając ze swojej unikalnej perspektywy.\n\nTWOJA ROLA:\n${agent.description}\n\nTWOJA PERSPEKTYWA:\n${agent.perspective}\n\nTWOJA SPECJALIZACJA:\n${agent.specialization.join(', ')}\n\nPROFIL UŻYTKOWNIKA (użyj tych informacji, aby spersonalizować odpowiedź):\n${profileSummary}\n\nAKTUALNA ENERGIA DNIA (nawiąż do tego, jeśli pasuje do kontekstu):\n${currentEnergy}\n\nINSTRUKCJE:\n- Odpowiadaj ZAWSZE jako ${agent.name}. Nie przedstawiaj się za każdym razem, po prostu bądź tą postacią.\n- Twoja odpowiedź MUSI być w języku polskim.\n- Twoja odpowiedź powinna być mądra, empatyczna i praktyczna.\n- ${selectedAgent === 'echo' ? 'Zadawaj pytania, które pomogą użytkownikowi w głębszej refleksji. Unikaj dawania bezpośrednich rad.' : 'Dawaj konkretne, praktyczne porady, które użytkownik może zastosować w życiu.'}\n- Rozpoczynaj swoją odpowiedź bezpośrednio, bez żadnych wstępów typu "Jako [agent]...". Użytkownik wie, z kim rozmawia.`;

    // When no specific agent is selected by the user, the prompt should instruct the council to pick one.
    if (!selectedAgent) {
      return `Jesteś Radą Kosmiczną - kolektywną inteligencją złożoną z sześciu mądrych agentów. Twoim zadaniem jest przeanalizowanie pytania użytkownika i wybranie NAJLEPSZEGO agenta do udzielenia odpowiedzi.\n\nAGENCI W RADZIE:\n${Object.values(COUNCIL_AGENTS).map(agent => 
  `- ${agent.avatar} ${agent.name}: ${agent.perspective}`
).join('\n')}\n\nPROFIL UŻYTKOWNIKA:\n${profileSummary}\n\nAKTUALNA ENERGIA DNIA:\n${currentEnergy}\n\nINSTRUKCJE:\n1.  Przeanalizuj poniższe pytanie użytkownika.\n2.  Wybierz JEDNEGO, najbardziej odpowiedniego agenta z powyższej listy.\n3.  Sformułuj odpowiedź CAŁKOWICIE z perspektywy wybranego agenta.\n4.  Rozpocznij odpowiedź, podając identyfikator agenta w formacie: "agent:[ID_AGENTA]". Na przykład: "agent:oracle".\n5.  Po identyfikatorze, kontynuuj odpowiedź jako ten agent, bez żadnych dodatkowych wstępów.\n6.  Odpowiedź musi być w języku polskim.`;
    }

    return basePrompt;
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
    const cleanContent = content.replace(new RegExp(`^${agentConfig.avatar}\s*${agentConfig.name}:\s*`, 'i'), '');
    
    return `${agentConfig.avatar} **${agentConfig.name}**: ${cleanContent}`;
  }

  async getAvailableModels(): Promise<OpenRouterModel[]> {
    // This method might need to be adapted or removed if models are not fetched from the client side anymore.
    // For now, returning a hardcoded list or an empty array.
    return [];
  }
}
