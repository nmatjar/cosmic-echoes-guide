
import { UserProfile } from "./userProfile";

// Definiuje dane wejściowe dla silnika analitycznego
export interface BirthData {
  date: Date;
  // W przyszłości można dodać więcej danych, np. imiona, miejsce urodzenia
  // name?: string;
  // birthPlace?: { latitude: number; longitude: number };
}

// Ogólny interfejs dla wyniku analizy z dowolnego modułu
export interface AnalysisResult {
  [key: string]: any;
}

// Interfejs, który każdy moduł analityczny musi implementować
export interface AnalysisModule {
  name: string;
  calculate(birthData: BirthData): Promise<AnalysisResult>;
}

// Struktura dla zagregowanych wyników z całego silnika
export interface ComprehensiveAnalysis {
  numerology?: AnalysisResult;
  mayan?: AnalysisResult;
  astrology?: AnalysisResult;
  humanDesign?: AnalysisResult;
  chineseZodiac?: AnalysisResult;
  biorhythms?: AnalysisResult;
  elementalBalance?: AnalysisResult;
  // ... inne systemy
}

export interface AstrologyAnalysis extends AnalysisResult {
  sunSign: { name: string; icon: string };
  ascendant?: { name: string; icon: string }; // Opcjonalnie, jeśli będzie rozbudowane
}

export interface ChineseZodiacAnalysis extends AnalysisResult {
  animal: string;
  icon: string;
  element: string;
}

export interface HumanDesignAnalysis extends AnalysisResult {
  type: string;
  profile: string;
  authority: string;
}

export interface MayanAnalysis extends AnalysisResult {
  sign: string;
  tone: number;
}

export interface BioRhythmAnalysis extends AnalysisResult {
  physical: { cycle: number; phase: string; energy: string };
  emotional: { cycle: number; phase: string; energy: string };
  intellectual: { cycle: number; phase: string; energy: string };
}

export interface ElementalBalanceAnalysis extends AnalysisResult {
  fire: number;
  earth: number;
  metal: number;
  water: number;
  wood: number;
  dominantElements: string[];
  weakElements: string[];
}

export interface Expert {
  id: string;
  name: string;
  specialization: string[];
  bio: string;
  contact_email?: string;
  profile_picture_url?: string;
  external_link?: string;
  is_active: boolean;
  tier?: string;
  meta_prompt: string;
  created_at: string;
  updated_at: string;
}
