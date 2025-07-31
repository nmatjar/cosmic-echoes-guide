import { AnalysisModule, BirthData, HumanDesignAnalysis } from "../types";
import humanDesignData from "../data/humanDesign.json";

// Funkcja pomocnicza do uzyskania powtarzalnej liczby z daty
const getDeterministicNumber = (date: Date): number => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // Prosta operacja, aby uzyskać unikalną, ale powtarzalną liczbę
  return (day * 7) + (month * 13) + (year * 3);
};

export class HumanDesignModule implements AnalysisModule {
  name: string = "humanDesign";

  async calculate(birthData: BirthData): Promise<HumanDesignAnalysis> {
    const birthDate = new Date(birthData.date);
    const seed = getDeterministicNumber(birthDate);

    // Użyjemy operacji modulo, aby deterministycznie wybrać wartości z tablic
    // To nie jest prawdziwa kalkulacja HD, ale daje spójne wyniki dla danego użytkownika

    // Wybór typu - dodajemy specjalną logikę dla Manifestującego Generatora
    const typeIndexSeed = seed % 100;
    let determinedType;
    if (typeIndexSeed < 35) { // ~35% szans na Generatora
      determinedType = humanDesignData.types.find(t => t.name === "Generator");
    } else if (typeIndexSeed < 70) { // ~35% szans na Manifestującego Generatora
      determinedType = humanDesignData.types.find(t => t.name === "Manifestujący Generator");
    } else if (typeIndexSeed < 90) { // ~20% szans na Projektora
      determinedType = humanDesignData.types.find(t => t.name === "Projektor");
    } else if (typeIndexSeed < 99) { // ~9% szans na Manifestora
      determinedType = humanDesignData.types.find(t => t.name === "Manifestor");
    } else { // ~1% szans na Reflektora
      determinedType = humanDesignData.types.find(t => t.name === "Reflektor");
    }
    
    // Fallback, gdyby coś poszło nie tak
    if (!determinedType) {
      determinedType = humanDesignData.types[seed % humanDesignData.types.length];
    }

    // Wybór profilu
    const profileIndex = (seed + 17) % humanDesignData.profiles.length;
    const determinedProfile = humanDesignData.profiles[profileIndex];

    // Wybór autorytetu
    const authorityIndex = (seed + 31) % humanDesignData.authorities.length;
    const determinedAuthority = humanDesignData.authorities[authorityIndex];

    return {
      type: determinedType.name,
      profile: determinedProfile.name,
      authority: determinedAuthority.name,
      // W przyszłości można by dodać opisy bezpośrednio do wyniku
    };
  }
}