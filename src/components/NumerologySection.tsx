
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import numerologyData from "@/engine/data/numerology.json";
import { createAIPrompt } from "@/lib/prompts";
import { CopyPromptButton } from "./ui/copy-button";

interface NumerologySectionProps {
  profile: UserProfile | null;
}

export function NumerologySection({ profile }: NumerologySectionProps) {
  if (!profile || !profile.analysis.numerology) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">🔢 Numerologia</h2>
        <p className="text-muted-foreground">Brak danych numerologicznych. Utwórz profil, aby zobaczyć analizę.</p>
      </div>
    );
  }

  const { lifePathNumber } = profile.analysis.numerology;
  const interpretation = (numerologyData.lifePathNumber as any)[lifePathNumber];

  if (!interpretation) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">🔢 Numerologia</h2>
        <p className="text-muted-foreground">Brak interpretacji dla liczby {lifePathNumber}.</p>
      </div>
    );
  }

  const { title, description, lightEnergies, shadowEnergies } = interpretation;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🔢 Numerologia
        </h2>
        <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary text-lg font-bold">
          {lifePathNumber}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="text-xl font-bold text-primary mb-2">✨ {title}</h3>
          <p className="text-sm text-primary/80">Twoja Droga Życia</p>
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">📜 Znaczenie</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'NUMEROLOGY_DESCRIPTION' })} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-secondary">☀️ Energie Światła</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: lightEnergies.join(', '), userProfile: profile, promptType: 'NUMEROLOGY_LIGHT_ENERGIES' })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {lightEnergies.map((energy: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {energy}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-accent">🌑 Energie Cienia</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: shadowEnergies.join(', '), userProfile: profile, promptType: 'NUMEROLOGY_SHADOW_ENERGIES' })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {shadowEnergies.map((energy: string, index: number) => (
                <Badge key={index} variant="destructive">
                  {energy}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

