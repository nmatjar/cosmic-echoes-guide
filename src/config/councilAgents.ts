import { CouncilAgentConfig } from '../types/council';

export const COUNCIL_AGENTS: Record<string, CouncilAgentConfig> = {
  architect: {
    id: 'architect',
    name: 'Architekt',
    avatar: '🏗️',
    description: 'Mistrz struktury i długoterminowego planowania',
    specialization: ['Numerologia', 'Human Design (strategia)', 'Saturn', 'Planowanie'],
    perspective: 'Logika, struktura, długoterminowe planowanie, praktyczne zastosowanie',
    exampleQuestion: 'Jak mogę przekuć ten wgląd w konkretny, tygodniowy plan działania?'
  },
  oracle: {
    id: 'oracle',
    name: 'Wyrocznia',
    avatar: '🔮',
    description: 'Strażniczka potencjału i wizji przyszłości',
    specialization: ['Astrologia (tranzyty)', 'Kalendarz Majów', 'Neptun', 'Intuicja'],
    perspective: 'Potencjał, wizja, intuicja, sny, "co może być"',
    exampleQuestion: 'Co ta sytuacja próbuje mi pokazać z szerszej perspektywy?'
  },
  alchemist: {
    id: 'alchemist',
    name: 'Alchemiczka',
    avatar: '⚗️',
    description: 'Mistrzyni transformacji emocjonalnej i uzdrawiania',
    specialization: ['Równowaga Żywiołów', 'Bio-Rytmy (emocje)', 'Księżyc', 'Relacje'],
    perspective: 'Emocje, relacje, uzdrawianie, harmonia wewnętrzna',
    exampleQuestion: 'Jak mogę pracować z emocjami, które się we mnie pojawiają?'
  },
  pioneer: {
    id: 'pioneer',
    name: 'Pionier',
    avatar: '🚀',
    description: 'Wojownik działania i przełamywania barier',
    specialization: ['Human Design (centra motoryczne)', 'Chiński Zodiak', 'Mars', 'Energia'],
    perspective: 'Działanie, energia, przełamywanie barier, wyzwania',
    exampleQuestion: 'Jaki jest pierwszy, najodważniejszy krok, który mogę teraz zrobić?'
  },
  chronicler: {
    id: 'chronicler',
    name: 'Kronikarz',
    avatar: '📜',
    description: 'Strażnik mądrości i wzorców karmicznych',
    specialization: ['Synteza systemów', 'Historia profilu', 'Merkury', 'Wzorce'],
    perspective: 'Mądrość, przeszłe wzorce, lekcje karmiczne, "dlaczego"',
    exampleQuestion: 'Jaki wzorzec z mojej przeszłości powtarza się w tej sytuacji?'
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    avatar: '〰️',
    description: 'Lustro refleksji i głębokiego poznania siebie',
    specialization: ['Refleksja', 'Pytania', 'Samopoznanie', 'Lustro'],
    perspective: 'Refleksja, zadawanie pytań, lustro. Ten agent nie daje rad.',
    exampleQuestion: 'Powiedziałeś, że czujesz "opór". Co dokładnie dla Ciebie oznacza to słowo?'
  }
};

export const OPENROUTER_MODELS = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Najnowszy model Anthropic, doskonały do złożonych rozmów',
    contextLength: 200000
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'Najnowszy model OpenAI z multimodalnym wsparciem',
    contextLength: 128000
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Najnowszy model Google z zaawansowanymi możliwościami',
    contextLength: 1000000
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Szybka wersja Gemini 2.5 do prostych zadań',
    contextLength: 1000000
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Model Google z ogromnym oknem kontekstowym',
    contextLength: 1000000
  },
  {
    id: 'x-ai/grok-4',
    name: 'Grok 4',
    description: 'Najnowszy model xAI z unikalną perspektywą',
    contextLength: 128000
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    description: 'Największy open-source model Meta',
    contextLength: 32768
  },
  {
    id: 'moonshotai/kimi-k2',
    name: 'Kimi K2',
    description: 'Zaawansowany model Moonshot AI',
    contextLength: 200000
  },
  {
    id: 'moonshotai/kimi-k2:free',
    name: 'Kimi K2 Free',
    description: 'Darmowa wersja modelu Kimi K2',
    contextLength: 200000
  },
  {
    id: 'tencent/hunyuan-a13b-instruct',
    name: 'Hunyuan A13B',
    description: 'Model Tencent do instrukcji i rozmów',
    contextLength: 32768
  },
  {
    id: 'baidu/ernie-4.5-300b-a47b',
    name: 'ERNIE 4.5 300B',
    description: 'Potężny model Baidu do złożonych zadań',
    contextLength: 128000
  },
  {
    id: 'qwen/qwen3-30b-a3b-instruct-2507',
    name: 'Qwen3 30B Instruct',
    description: 'Model Alibaba do instrukcji i analiz',
    contextLength: 32768
  },
  {
    id: 'z-ai/glm-4.5',
    name: 'GLM 4.5',
    description: 'Model GLM do zaawansowanych rozmów',
    contextLength: 128000
  },
  {
    id: 'openrouter/horizon-alpha',
    name: 'Horizon Alpha',
    description: 'Eksperymentalny model OpenRouter',
    contextLength: 128000
  },
  {
    id: 'switchpoint/router',
    name: 'Switchpoint Router',
    description: 'Inteligentny router wybierający najlepszy model',
    contextLength: 128000
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Szybki i ekonomiczny model Anthropic',
    contextLength: 200000
  }
];
