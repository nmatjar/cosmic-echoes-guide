
import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import numerologyData from "@/engine/data/numerology.json";
import { createAIPrompt } from "@/lib/prompts";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyPromptButtonProps {
  promptText: string;
}

function CopyPromptButton({ promptText }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    toast.success("✨ Prompt skopiowany do schowka!", {
      description: "Wklej go do swojego ulubionego AI.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="h-8 w-8 bg-cosmic-purple/20 border-cosmic-purple/30 hover:bg-cosmic-purple/30 text-cosmic-starlight"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}


interface NumerologySectionProps {
  profile: UserProfile | null;
}

export function NumerologySection({ profile }: NumerologySectionProps) {
  if (!profile || !profile.analysis.numerology) {
    return (
      <CosmicCard variant="stellar" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">🔢 Numerologia</h2>
        <p className="text-muted-foreground">Brak danych numerologicznych. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { lifePathNumber } = profile.analysis.numerology;
  const interpretation = (numerologyData.lifePathNumber as any)[lifePathNumber];

  if (!interpretation) {
    return (
      <CosmicCard variant="stellar" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">🔢 Numerologia</h2>
        <p className="text-muted-foreground">Brak interpretacji dla liczby {lifePathNumber}.</p>
      </CosmicCard>
    );
  }

  const { title, description, lightEnergies, shadowEnergies } = interpretation;

  return (
    <CosmicCard variant="stellar" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🔢 Numerologia
        </h2>
        <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold text-lg font-bold">
          {lifePathNumber}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="text-center p-4 bg-cosmic-gold/10 rounded-lg border border-cosmic-gold/20">
          <h3 className="text-xl font-bold text-cosmic-gold mb-2">✨ {title}</h3>
          <p className="text-sm text-cosmic-gold/80">Twoja Droga Życia</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-cosmic-gold">📜 Znaczenie</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'NUMEROLOGY_DESCRIPTION' })} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-teal">☀️ Energie Światła</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: lightEnergies.join(', '), userProfile: profile, promptType: 'NUMEROLOGY_LIGHT_ENERGIES' })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {lightEnergies.map((energy: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal text-xs">
                  {energy}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-pink">🌑 Energie Cienia</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: shadowEnergies.join(', '), userProfile: profile, promptType: 'NUMEROLOGY_SHADOW_ENERGIES' })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {shadowEnergies.map((energy: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink text-xs">
                  {energy}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}

