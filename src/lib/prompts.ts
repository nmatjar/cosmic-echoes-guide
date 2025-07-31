import { UserProfile } from "@/engine/userProfile";
import astrologyData from "@/engine/data/astrology.json";
import numerologyData from "@/engine/data/numerology.json";
import chineseZodiacData from "@/engine/data/chineseZodiac.json";
import humanDesignData from "@/engine/data/humanDesign.json";
import mayanData from "@/engine/data/mayan.json";

export type PromptType = 
  // Astrology
  'ASTROLOGY_DESCRIPTION' | 'ASTROLOGY_STRENGTHS' | 'ASTROLOGY_WEAKNESSES' |
  // Numerology
  'NUMEROLOGY_DESCRIPTION' | 'NUMEROLOGY_LIGHT_ENERGIES' | 'NUMEROLOGY_SHADOW_ENERGIES' |
  // Chinese Zodiac
  'CHINESE_ZODIAC_DESCRIPTION' | 'CHINESE_ZODIAC_STRENGTHS' | 'CHINESE_ZODIAC_WEAKNESSES' |
  // Mayan Calendar
  'MAYAN_SIGN_DESCRIPTION' | 'MAYAN_TONE_DESCRIPTION' |
  // Human Design
  'HUMAN_DESIGN_TYPE_STRATEGY' | 'HUMAN_DESIGN_AUTHORITY' | 'HUMAN_DESIGN_PROFILE' |
  // Smart Prompt Generator
  'GENERAL_ANALYSIS';

interface CreatePromptOptions {
  mainContent: string;
  userProfile: UserProfile;
  promptType: PromptType;
  // For smart generator
  smartPromptConfig?: {
    detailLevel: number;
    focusAreas: string[];
    personalityType: string;
  };
}

const getProfileSummary = (profile: UserProfile): string => {
  const astro = profile.analysis.astrology ? astrologyData.sunSigns.find(s => s.name === profile.analysis.astrology.sunSign.name) : null;
  const numero = profile.analysis.numerology ? (numerologyData.lifePathNumber as any)[profile.analysis.numerology.lifePathNumber] : null;
  const cZodiac = profile.analysis.chineseZodiac ? chineseZodiacData.animals.find(a => a.name === profile.analysis.chineseZodiac.animal) : null;
  const hd = profile.analysis.humanDesign ? humanDesignData.types.find(t => t.name === profile.analysis.humanDesign.type) : null;
  const mayan = profile.analysis.mayan ? mayanData.signs.find(s => s.name === profile.analysis.mayan.sign) : null;

  return [
    `- Astrologia: ${astro?.name || 'Brak danych'} (${astro?.element}, ${astro?.modality})`,
    `- Numerologia: Droga Życia ${profile.analysis.numerology?.lifePathNumber || 'Brak'} (${numero?.title})`,
    `- Zodiak Chiński: ${cZodiac?.name || 'Brak'} (Żywioł: ${profile.analysis.chineseZodiac?.element})`,
    `- Human Design: ${hd?.name || 'Brak'} (Strategia: ${hd?.strategy})`,
    `- Kalendarz Majów: Kin ${profile.analysis.mayan?.tone || 'Brak'} ${mayan?.name || 'Brak'}`,
  ].join('\n');
};

const getSpecificInstructions = (promptType: PromptType, options: CreatePromptOptions): string => {
  switch (promptType) {
    // --- ASTROLOGY ---
    case 'ASTROLOGY_DESCRIPTION':
      return `Twoim zadaniem jest rozwinięcie poniższego opisu mojego znaku zodiaku. Podaj 3 praktyczne przykłady, jak te cechy mogą manifestować się w moim codziennym życiu (w pracy, w relacjach, w hobby).`;
    case 'ASTROLOGY_STRENGTHS':
      return `Skup się wyłącznie na tych mocnych stronach. Dla każdej z nich podaj jeden konkretny przykład, jak mogę ją świadomie wykorzystać w tym tygodniu, aby poprawić jakość swojego życia.`;
    case 'ASTROLOGY_WEAKNESSES':
      return `To są moje słabe strony. Dla każdej z nich podaj jedną praktyczną radę lub ćwiczenie, które pomoże mi zrównnoważyć tę energię, zamiast ją tłumić. Unikaj ogólników.`;

    // --- NUMEROLOGY ---
    case 'NUMEROLOGY_DESCRIPTION':
      return `Rozwiń ten opis mojej Drogi Życia. Wyjaśnij, jakie lekcje i wyzwania są z nią związane i jak mogę najlepiej podążać tą ścieżką.`;
    case 'NUMEROLOGY_LIGHT_ENERGIES':
      return `To są moje energie światła. Wybierz dwie z nich i stwórz dla mnie krótką, pozytywną afirmację, którą mogę powtarzać, aby wzmocnić te cechy.`;
    case 'NUMEROLOGY_SHADOW_ENERGIES':
      return `To są moje energie cienia. Wyjaśnij, w jakich sytuacjach mogą się one najczęściej pojawiać i podaj jeden sygnał ostrzegawczy dla każdej z nich, na który powinienem zwracać uwagę.`;
    
    // --- GENERAL ---
    case 'GENERAL_ANALYSIS':
      const config = options.smartPromptConfig;
      if (!config) return "Przeanalizuj mój profil i odpowiedz na moje pytanie.";
      const detailLevels = { 1: "podstawowe", 2: "rozszerzone", 3: "szczegółowe", 4: "eksperckie", 5: "mistrzowskie" };
      return `Przeanalizuj mój kompletny profil w kontekście moich pytań. Skup się na obszarach: ${config.focusAreas.join(', ')}. Dostosuj styl odpowiedzi do mojej ${config.personalityType} osobowości. Oczekuję ${detailLevels[config.detailLevel]} analizy. Używaj konkretnych przykładów i praktycznych wskazówek, łącząc różne systemy w spójną interpretację.`;

    default:
      return "Rozwiń poniższy tekst w kontekście całego mojego profilu. Bądź zwięzły i praktyczny.";
  }
};

export const createAIPrompt = (options: CreatePromptOptions): string => {
  const { mainContent, userProfile, promptType } = options;

  const persona = "Jesteś światowej klasy ekspertem w dziedzinie astrologii, numerologii, Human Design i innych systemów samopoznania. Twoim celem jest dostarczanie głębokich, ale praktycznych i zrozumiałych wglądów.";
  
  const profileSummary = getProfileSummary(userProfile);
  const specificInstructions = getSpecificInstructions(promptType, options);

  return `
### ROLA I CEL
${persona}

### KONTEKST (Mój Kosmiczny Portret)
Oto podsumowanie mojego unikalnego profilu energetycznego:
${profileSummary}

---

### ZADANIE DO WYKONANIA

**Analizowany fragment:**
"${mainContent}"

**Twoje zadanie:**
${specificInstructions}

Odpowiedz w języku polskim.
  `.trim();
};