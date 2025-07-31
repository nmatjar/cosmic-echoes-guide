import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { UserProfile } from "@/engine/userProfile";
import humanDesignData from "@/engine/data/humanDesign.json";
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

interface HumanDesignSectionProps {
  profile: UserProfile | null;
}

export function HumanDesignSection({ profile }: HumanDesignSectionProps) {
  if (!profile || !profile.analysis.humanDesign) {
    return (
      <CosmicCard variant="default" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Human Design</h2>
        <p className="text-muted-foreground">Brak danych Human Design. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { type, profile: hdProfile, authority } = profile.analysis.humanDesign;

  const typeData = humanDesignData.types.find(t => t.name === type);
  const profileData = humanDesignData.profiles.find(p => p.name === hdProfile);
  const authorityData = humanDesignData.authorities.find(a => a.name === authority);

  if (!typeData || !profileData || !authorityData) {
    return (
      <CosmicCard variant="default" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Human Design</h2>
        <p className="text-muted-foreground">Błąd wczytywania interpretacji Human Design.</p>
      </CosmicCard>
    );
  }

  return (
    <CosmicCard variant="default" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🎭 Human Design
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple">
            {type.includes("Generator") ? "MG" : type.substring(0, 2).toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-cosmic-blue/20 border-cosmic-blue/30 text-cosmic-blue">
            {hdProfile.substring(0, 3)}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">⚡ Typ: {type}</h3>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: `${typeData.description} Moja strategia to: ${typeData.strategy}`, userProfile: profile, promptType: 'HUMAN_DESIGN_TYPE_STRATEGY' })} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {typeData.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Strategia: {typeData.strategy}</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-pink">🎯 Autorytet: {authority}</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: authorityData.description, userProfile: profile, promptType: 'HUMAN_DESIGN_AUTHORITY' })} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {authorityData.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-teal">👑 Profil: {hdProfile}</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: profileData.description, userProfile: profile, promptType: 'HUMAN_DESIGN_PROFILE' })} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profileData.description}
            </p>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}


