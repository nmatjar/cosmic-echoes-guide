import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { UserProfile } from "@/engine/userProfile";
import mayanData from "@/engine/data/mayan.json";
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

interface MayanSectionProps {
  profile: UserProfile | null;
}

export function MayanSection({ profile }: MayanSectionProps) {
  if (!profile || !profile.analysis.mayan) {
    return (
      <CosmicCard variant="mystical" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Kalendarz Majów</h2>
        <p className="text-muted-foreground">Brak danych Kalendarza Majów. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { sign, tone } = profile.analysis.mayan;
  
  const signData = mayanData.signs.find(s => s.name === sign);
  const toneData = mayanData.tones.find(t => t.number === tone);

  if (!signData || !toneData) {
    return (
      <CosmicCard variant="mystical" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Kalendarz Majów</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla Kina: {tone} {sign}.</p>
      </CosmicCard>
    );
  }

  return (
    <CosmicCard variant="mystical" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🏛️ Kalendarz Majów
        </h2>
        <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold">
          Kin: {tone} {sign.split(' ')[1]}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cosmic-gold">{sign}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: signData.description, userProfile: profile, promptType: 'MAYAN_SIGN_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {signData.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {signData.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cosmic-gold">Ton {toneData.number} - {toneData.name}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: toneData.description, userProfile: profile, promptType: 'MAYAN_TONE_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {toneData.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {toneData.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </CosmicCard>
  );
}


