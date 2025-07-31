import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import astrologyData from "@/engine/data/astrology.json";
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

interface AstrologicalSectionProps {
  profile: UserProfile | null;
}

export function AstrologicalSection({ profile }: AstrologicalSectionProps) {
  if (!profile || !profile.analysis.astrology) {
    return (
      <CosmicCard variant="mystical" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Astrologia Zachodnia</h2>
        <p className="text-muted-foreground">Brak danych astrologicznych. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { sunSign: sunSignResult } = profile.analysis.astrology;
  const sunSignData = astrologyData.sunSigns.find(s => s.name === sunSignResult.name);

  if (!sunSignData) {
    return (
      <CosmicCard variant="mystical" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Astrologia Zachodnia</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla znaku {sunSignResult.name}.</p>
      </CosmicCard>
    );
  }

  const { name, icon, description, strengths, weaknesses, element, modality } = sunSignData;

  return (
    <CosmicCard variant="mystical" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {icon} Astrologia Zachodnia
        </h2>
        <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink">
          {name}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cosmic-gold">🌞 Słońce w {name}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'ASTROLOGY_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">{element}</Badge>
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">{modality}</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-cosmic-teal">☀️ Mocne strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: strengths.join(', '), userProfile: profile, promptType: 'ASTROLOGY_STRENGTHS' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <Badge key={index} variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal text-xs">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-cosmic-pink">🌑 Słabe strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: weaknesses.join(', '), userProfile: profile, promptType: 'ASTROLOGY_WEAKNESSES' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((weakness, index) => (
              <Badge key={index} variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink text-xs">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}


