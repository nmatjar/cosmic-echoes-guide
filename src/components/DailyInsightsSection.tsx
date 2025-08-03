import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/engine/userProfile";
import { BioRhythmModule } from "@/engine/modules/biorhythms";
import { MayanModule } from "@/engine/modules/mayan";
import { format } from 'date-fns';
import biorhythmData from "@/engine/data/biorhythms.json";

interface DailyInsightsSectionProps {
  profile: UserProfile | null;
}

export function DailyInsightsSection({ profile }: DailyInsightsSectionProps) {
  const [todayBioRhythms, setTodayBioRhythms] = useState<any>(null);
  const [todayMayan, setTodayMayan] = useState<any>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const bioRhythmModule = new BioRhythmModule();
  const mayanModule = new MayanModule();

  useEffect(() => {
    const fetchDailyInsights = async () => {
      if (profile?.birthData.date) {
        const birthDate = new Date(profile.birthData.date);
        const today = new Date();

        const bioResult = await bioRhythmModule.calculate({ date: birthDate }, today);
        setTodayBioRhythms(bioResult);

        const mayanResult = await mayanModule.calculate({ date: birthDate }, today);
        setTodayMayan(mayanResult);
      }
    };

    fetchDailyInsights();
    const interval = setInterval(fetchDailyInsights, 60 * 60 * 1000); // Update hourly

    return () => clearInterval(interval);
  }, [profile]);

  const generateAiPrompt = () => {
    if (!profile) {
      setAiPrompt("Brak profilu do wygenerowania spersonalizowanego promptu.");
      return;
    }

    const profileJson = JSON.stringify(profile, null, 2);

    const prompt = `Jesteś zaawansowanym doradcą duchowym i analitykiem danych osobowych. Twoim zadaniem jest zinterpretowanie dnia dzisiejszego dla użytkownika, bazując na jego kompleksowym profilu kosmicznym i aktualnych wpływach.

--- Profil Użytkownika (JSON) ---
${profileJson}

--- Dzisiejsze Wpływy ---
Bio-Rytmy:
  Fizyczny: ${todayBioRhythms?.physical.energy || 'N/A'}
  Emocjonalny: ${todayBioRhythms?.emotional.energy || 'N/A'}
  Intelektualny: ${todayBioRhythms?.intellectual.energy || 'N/A'}
Kalendarz Majów:
  Znak (Kin): ${todayMayan?.sign || 'N/A'}
  Ton: ${todayMayan?.tone || 'N/A'}

--- Instrukcje dla Ciebie ---
Na podstawie powyższych danych, wygeneruj spersonalizowaną interpretację tego, co ten dzień wnosi konkretnie dla użytkownika. Skup się na:
1. Kluczowych energiach i wyzwaniach dnia.
2. Potencjalnych możliwościach i obszarach do rozwoju.
3. Praktycznych wskazówkach, jak najlepiej wykorzystać te wpływy.
4. Użyj języka inspirującego i wspierającego. Odpowiedz w języku polskim.

Twoja interpretacja:`;

    setAiPrompt(prompt);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'high': return 'bg-secondary/20 text-secondary-foreground';
      case 'low': return 'bg-accent/20 text-accent-foreground';
      case 'critical': return 'bg-primary/20 text-primary-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          ✨ Dzisiejsze Wpływy ({format(new Date(), 'dd.MM.yyyy')})
        </h2>
      </div>

      {!profile?.birthData.date && (
        <p className="text-muted-foreground">Brak danych urodzeniowych. Utwórz profil, aby zobaczyć dzisiejsze wpływy.</p>
      )}

      {profile?.birthData.date && (
        <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <h3 className="text-xl font-bold text-primary">Bio-Rytmy</h3>
          {todayBioRhythms ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(todayBioRhythms.physical.phase)}`}>
                <span className="text-lg font-semibold">Fizyczny</span>
                <span className="text-sm">{biorhythmData.phases[todayBioRhythms.physical.phase]}</span>
              </Badge>
              <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(todayBioRhythms.emotional.phase)}`}>
                <span className="text-lg font-semibold">Emocjonalny</span>
                <span className="text-sm">{biorhythmData.phases[todayBioRhythms.emotional.phase]}</span>
              </Badge>
              <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(todayBioRhythms.intellectual.phase)}`}>
                <span className="text-lg font-semibold">Intelektualny</span>
                <span className="text-sm">{biorhythmData.phases[todayBioRhythms.intellectual.phase]}</span>
              </Badge>
            </div>
          ) : (
            <p className="text-muted-foreground">Ładowanie danych bio-rytmów...</p>
          )}
        </div>
      )}

      {profile?.birthData.date && (
        <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <h3 className="text-xl font-bold text-primary">Kalendarz Majów</h3>
          {todayMayan ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary p-3">
                <span className="font-semibold">Znak (Kin):</span> {todayMayan.sign}
              </Badge>
              <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary p-3">
                <span className="font-semibold">Ton:</span> {todayMayan.tone}
              </Badge>
              {/* Add more Mayan insights here if available */}
            </div>
          ) : (
            <p className="text-muted-foreground">Ładowanie danych Kalendarza Majów...</p>
          )}
        </div>
      )}

      {profile?.birthData.date && (
        <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <Button onClick={generateAiPrompt} className="w-full">
            Wygeneruj Spersonalizowaną Interpretację Dnia (AI)
          </Button>
          {aiPrompt && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-primary">Prompt dla AI:</h4>
              <Textarea
                value={aiPrompt}
                readOnly
                rows={15}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Powyższy tekst to prompt, który zostałby wysłany do modelu AI w celu wygenerowania spersonalizowanej interpretacji dnia.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
