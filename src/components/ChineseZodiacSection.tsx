import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { UserProfile } from "@/engine/userProfile";
import chineseZodiacData from "@/engine/data/chineseZodiac.json";
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

interface ChineseZodiacSectionProps {
  profile: UserProfile | null;
}

export function ChineseZodiacSection({ profile }: ChineseZodiacSectionProps) {
  if (!profile || !profile.analysis.chineseZodiac) {
    return (
      <CosmicCard variant="aurora" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Horoskop Chiński</h2>
        <p className="text-muted-foreground">Brak danych chińskiego zodiaku. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { animal, icon, element } = profile.analysis.chineseZodiac;
  const animalData = chineseZodiacData.animals.find(a => a.name === animal);

  if (!animalData) {
    return (
      <CosmicCard variant="aurora" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Horoskop Chiński</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla zwierzęcia {animal}.</p>
      </CosmicCard>
    );
  }

  const { description, strengths, weaknesses } = animalData;

  return (
    <CosmicCard variant="aurora" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {icon} Horoskop Chiński
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink">
            {icon} {animal}
          </Badge>
          <Badge variant="outline" className="bg-cosmic-teal/20 border-cosmic-teal/30 text-cosmic-teal">
            {element}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cosmic-gold">{icon} {animal} - Opis</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'CHINESE_ZODIAC_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-cosmic-teal">☀️ Mocne strony</h4>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: strengths.join(', '), userProfile: profile, promptType: 'CHINESE_ZODIAC_STRENGTHS' })} />
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <Badge key={index} variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal text-xs">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-md font-semibold text-cosmic-pink">🌑 Słabe strony</h4>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: weaknesses.join(', '), userProfile: profile, promptType: 'CHINESE_ZODIAC_WEAKNESSES' })} />
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


