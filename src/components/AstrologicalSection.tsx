import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import astrologyData from "@/engine/data/astrology.json";
import { createAIPrompt } from "@/lib/prompts";
import { CopyPromptButton } from "./ui/copy-button";

interface AstrologicalSectionProps {
  profile: UserProfile | null;
}

export function AstrologicalSection({ profile }: AstrologicalSectionProps) {
  if (!profile || !profile.analysis.astrology) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Astrologia Zachodnia</h2>
        <p className="text-muted-foreground">Brak danych astrologicznych. Utwórz profil, aby zobaczyć analizę.</p>
      </div>
    );
  }

  const { sunSign: sunSignResult } = profile.analysis.astrology;
  const sunSignData = astrologyData.sunSigns.find(s => s.name === sunSignResult.name);

  if (!sunSignData) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Astrologia Zachodnia</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla znaku {sunSignResult.name}.</p>
      </div>
    );
  }

  const { name, icon, description, strengths, weaknesses, element, modality } = sunSignData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {icon} Astrologia Zachodnia
        </h2>
        <Badge variant="outline" className="border-accent/30 bg-accent/20 text-accent">
          {name}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">🌞 Słońce w {name}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'ASTROLOGY_DESCRIPTION' })} />
        </div>
        <div className="p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{element}</Badge>
            <Badge variant="secondary">{modality}</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">☀️ Mocne strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: strengths.join(', '), userProfile: profile, promptType: 'ASTROLOGY_STRENGTHS' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-accent">🌑 Słabe strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: weaknesses.join(', '), userProfile: profile, promptType: 'ASTROLOGY_WEAKNESSES' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((weakness, index) => (
              <Badge key={index} variant="secondary" className="bg-accent/20 text-accent-foreground">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


