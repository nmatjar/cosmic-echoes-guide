import { UserProfile } from '@/engine/userProfile';
import { getProfiles } from './profileManager';

// Typy dla interpretacji
interface Interpretations {
  [key: string]: string | number | boolean | object;
}

// Typy dla pozycji planet i domów
interface PlanetaryData {
  [key: string]: string | number;
}

// Typy dla centrów Human Design
interface HumanDesignCenters {
  [centerName: string]: "Defined" | "Open" | "Undefined";
}

// Typy dla kanałów Human Design
interface HumanDesignChannels {
  [channelId: string]: string;
}

// Typy dla cykli bio-rytmów
interface BiorhythmCycles {
  Physical?: string[];
  Emotional?: string[];
  Intellectual?: string[];
  [key: string]: string[] | undefined;
}

// Interfejs dla eksportu ProfileCoder 3.4
export interface ProfileCoder34Export {
  version: "3.4";
  exportDate: string;
  personalInfo: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  };
  diagnosticSystems: {
    numerology?: {
      LP?: number;    // Life Path Number
      EX?: number;    // Expression Number
      SU?: number;    // Soul Urge Number
      INT?: Interpretations;      // Interpretations
    };
    astrology?: {
      SS?: string;    // Sun Sign
      AS?: string;    // Ascendant
      MC?: string;    // Midheaven
      PL?: PlanetaryData;       // Planetary Positions
      HO?: PlanetaryData;       // House Cusps
      ASP?: PlanetaryData;      // Aspects
      INT?: Interpretations;      // Interpretations
    };
    chineseZodiac?: {
      AN?: string;    // Animal Sign
      EL?: string;    // Element
      POL?: string;   // Polarity
      INT?: Interpretations;      // Interpretations
    };
    humanDesign?: {
      TY?: string;    // Type
      PR?: string;    // Profile
      AU?: string;    // Authority
      CEN?: HumanDesignCenters;      // Centers
      CHA?: HumanDesignChannels;      // Channels
      GAT?: number[]; // Gates
      INT?: Interpretations;      // Interpretations
    };
    mayan?: {
      SI?: string;    // Sign (Kin)
      TO?: number;    // Tone
      WAV?: string;   // Wavespell
      DEST?: number;  // Destiny Kin
      INT?: Interpretations;      // Interpretations
    };
    biorhythms?: {
      PH?: string;    // Physical Cycle
      EM?: string;    // Emotional Cycle
      IN?: string;    // Intellectual Cycle
      CYC?: BiorhythmCycles;      // Cycle Peaks/Troughs
      INT?: Interpretations;      // Interpretations
    };
    elementalBalance?: {
      FIR?: string;   // Fire Element
      EAR?: string;   // Earth Element
      AIR?: string;   // Air Element
      WAT?: string;   // Water Element
      ETH?: string;   // Ether/Spirit Element
      DOM?: string[]; // Dominant Elements
      WEAK?: string[]; // Weak Elements
      INT?: Interpretations;      // Interpretations
    };
  };
  metadata: {
    source: "Cosmic Echoes Guide";
    profileCoderVersion: "3.4";
    exportedBy: string;
    originalId: string;
  };
}

// Konwersja UserProfile do formatu ProfileCoder 3.4
export function convertToProfileCoder34(userProfile: UserProfile): ProfileCoder34Export {
  return {
    version: "3.4",
    exportDate: new Date().toISOString(),
    personalInfo: {
      name: userProfile.name,
      birthDate: userProfile.birthData.date,
      birthTime: userProfile.birthData.time,
      birthPlace: userProfile.birthData.place,
    },
    diagnosticSystems: {
      // Mapowanie bezpośrednie - struktura jest już zgodna z ProfileCoder 3.4
      numerology: mapNumerology(userProfile.analysis.numerology),
      astrology: mapAstrology(userProfile.analysis.astrology),
      chineseZodiac: mapChineseZodiac(userProfile.analysis.chineseZodiac),
      humanDesign: mapHumanDesign(userProfile.analysis.humanDesign),
      mayan: mapMayan(userProfile.analysis.mayan),
      biorhythms: mapBiorhythms(userProfile.analysis.biorhythms),
      elementalBalance: mapElementalBalance(userProfile.analysis.elementalBalance),
    },
    metadata: {
      source: "Cosmic Echoes Guide",
      profileCoderVersion: "3.4",
      exportedBy: userProfile.name,
      originalId: userProfile.id,
    },
  };
}

// Funkcje mapowania dla każdego systemu
function mapNumerology(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  return {
    LP: data.lifePathNumber as number || data.LP as number,
    EX: data.expressionNumber as number || data.EX as number,
    SU: data.soulUrgeNumber as number || data.SU as number,
    INT: {
      lifePathDescription: data.lifePathDescription as string || data.interpretation as string,
      expressionGuidance: data.expressionGuidance as string,
      soulUrgeInsight: data.soulUrgeInsight as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapAstrology(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  const sunSign = data.sunSign as { name?: string } | undefined;
  const ascendant = data.ascendant as { name?: string } | undefined;
  
  return {
    SS: sunSign?.name || data.SS as string,
    AS: ascendant?.name || data.AS as string,
    MC: data.midheaven as string || data.MC as string,
    PL: data.planetaryPositions as PlanetaryData || data.PL as PlanetaryData || {},
    HO: data.houseCusps as PlanetaryData || data.HO as PlanetaryData || {},
    ASP: data.aspects as PlanetaryData || data.ASP as PlanetaryData || {},
    INT: {
      sunSignDescription: data.sunSignDescription as string || data.interpretation as string,
      risingSignImpact: data.risingSignImpact as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapChineseZodiac(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  return {
    AN: data.animal as string || data.AN as string,
    EL: data.element as string || data.EL as string,
    POL: data.polarity as string || data.POL as string,
    INT: {
      animalDescription: data.animalDescription as string || data.interpretation as string,
      elementInfluence: data.elementInfluence as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapHumanDesign(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  return {
    TY: data.type as string || data.TY as string,
    PR: data.profile as string || data.PR as string,
    AU: data.authority as string || data.AU as string,
    CEN: data.centers as HumanDesignCenters || data.CEN as HumanDesignCenters || {},
    CHA: data.channels as HumanDesignChannels || data.CHA as HumanDesignChannels || {},
    GAT: data.gates as number[] || data.GAT as number[] || [],
    INT: {
      typeDescription: data.typeDescription as string || data.interpretation as string,
      strategyGuidance: data.strategyGuidance as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapMayan(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  return {
    SI: data.sign as string || data.SI as string,
    TO: data.tone as number || data.TO as number,
    WAV: data.wavespell as string || data.WAV as string,
    DEST: data.destinyKin as number || data.DEST as number,
    INT: {
      kinDescription: data.kinDescription as string || data.interpretation as string,
      toneGuidance: data.toneGuidance as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapBiorhythms(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  const physical = data.physical as { energy?: string } | undefined;
  const emotional = data.emotional as { energy?: string } | undefined;
  const intellectual = data.intellectual as { energy?: string } | undefined;
  
  return {
    PH: physical?.energy || data.PH as string,
    EM: emotional?.energy || data.EM as string,
    IN: intellectual?.energy || data.IN as string,
    CYC: data.cyclePeaks as BiorhythmCycles || data.CYC as BiorhythmCycles || {},
    INT: {
      dailyGuidance: data.dailyGuidance as string || data.interpretation as string,
      weeklyForecast: data.weeklyForecast as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

function mapElementalBalance(data: Record<string, unknown> | undefined) {
  if (!data) return undefined;
  
  return {
    FIR: data.fire?.toString() || data.FIR as string,
    EAR: data.earth?.toString() || data.EAR as string,
    AIR: data.air?.toString() || data.AIR as string,
    WAT: data.water?.toString() || data.WAT as string,
    ETH: data.ether?.toString() || data.ETH as string,
    DOM: data.dominantElements as string[] || data.DOM as string[] || [],
    WEAK: data.weakElements as string[] || data.WEAK as string[] || [],
    INT: {
      balanceAnalysis: data.balanceAnalysis as string || data.interpretation as string,
      recommendations: data.recommendations as string,
      ...(data.INT as Record<string, unknown> || {})
    }
  };
}

// Eksport profilu do pliku JSON w formacie ProfileCoder 3.4
export function exportProfileCoder34ToFile(profileId?: string): void {
  const profiles = getProfiles();
  
  if (profiles.length === 0) {
    throw new Error("Nie znaleziono profilu do wyeksportowania.");
  }

  // Znajdź profil po ID lub użyj pierwszego dostępnego
  const profile = profileId 
    ? profiles.find(p => p.id === profileId) 
    : profiles[0];

  if (!profile) {
    throw new Error("Nie znaleziono profilu o podanym ID.");
  }

  // Konwertuj do formatu ProfileCoder 3.4
  const profileCoder34Data = convertToProfileCoder34(profile);

  // Stwórz plik JSON
  const jsonString = JSON.stringify(profileCoder34Data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Pobierz plik
  const link = document.createElement("a");
  link.href = url;
  link.download = `profilecoder-3.4-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Walidacja formatu ProfileCoder 3.4
export function validateProfileCoder34(data: unknown): boolean {
  try {
    const obj = data as Record<string, unknown>;
    
    // Sprawdź podstawowe pola
    if (!obj.version || obj.version !== "3.4") return false;
    
    const personalInfo = obj.personalInfo as Record<string, unknown> | undefined;
    if (!personalInfo || !personalInfo.name) return false;
    
    if (!obj.diagnosticSystems) return false;
    
    const metadata = obj.metadata as Record<string, unknown> | undefined;
    if (!metadata || !metadata.source) return false;

    return true;
  } catch (error) {
    return false;
  }
}

// Import z formatu ProfileCoder 3.4 (dla przyszłego użycia)
export function importFromProfileCoder34(data: ProfileCoder34Export): UserProfile {
  if (!validateProfileCoder34(data)) {
    throw new Error("Nieprawidłowy format ProfileCoder 3.4");
  }

  return {
    id: crypto.randomUUID(),
    name: data.personalInfo.name,
    birthData: {
      date: data.personalInfo.birthDate,
      time: data.personalInfo.birthTime,
      place: data.personalInfo.birthPlace,
    },
    analysis: data.diagnosticSystems,
    pin: "", // Będzie ustawiony przez użytkownika
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
