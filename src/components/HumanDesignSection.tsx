import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import humanDesignData from "@/engine/data/humanDesign.json";
import { createAIPrompt } from "@/lib/prompts";
import { CopyPromptButton } from "./ui/copy-button";

interface HumanDesignSectionProps {
  profile: UserProfile | null;
}

export function HumanDesignSection({ profile }: HumanDesignSectionProps) {
  if (!profile || !profile.analysis.humanDesign) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Human Design</h2>
        <p className="text-muted-foreground">Brak danych Human Design. Utwórz profil, aby zobaczyć analizę.</p>
      </div>
    );
  }

  const { type, profile: hdProfile, authority } = profile.analysis.humanDesign;

  const typeData = humanDesignData.types.find(t => t.name === type);
  const profileData = humanDesignData.profiles.find(p => p.name === hdProfile);
  const authorityData = humanDesignData.authorities.find(a => a.name === authority);

  if (!typeData || !profileData || !authorityData) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Human Design</h2>
        <p className="text-muted-foreground">Błąd wczytywania interpretacji Human Design.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🎭 Human Design
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary">
            {type.includes("Generator") ? "MG" : type.substring(0, 2).toUpperCase()}
          </Badge>
          <Badge variant="outline" className="border-secondary/30 bg-secondary/20 text-secondary">
            {hdProfile.substring(0, 3)}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">⚡ Typ: {type}</h3>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: `${typeData.description} Moja strategia to: ${typeData.strategy}`, userProfile: profile, promptType: 'HUMAN_DESIGN_TYPE_STRATEGY' })} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {typeData.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Strategia: {typeData.strategy}</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-secondary">🎯 Autorytet: {authority}</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: authorityData.description, userProfile: profile, promptType: 'HUMAN_DESIGN_AUTHORITY' })} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {authorityData.description}
            </p>
          </div>

          <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-accent">👑 Profil: {hdProfile}</h4>
              <CopyPromptButton promptText={createAIPrompt({ mainContent: profileData.description, userProfile: profile, promptType: 'HUMAN_DESIGN_PROFILE' })} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profileData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


