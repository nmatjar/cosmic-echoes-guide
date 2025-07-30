import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { CopyButton } from "@/components/ui/copy-button";
import { UserProfile } from "@/engine/userProfile";

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

  const typeDescription = `Jako ${type}, Twoja strategia to... (tutaj będzie dynamiczny opis dla ${type})`;
  const authorityDescription = `Twój autorytet to ${authority}. Twoje decyzje powinny być podejmowane poprzez... (tutaj będzie dynamiczny opis dla ${authority})`;
  const profileDescription = `Twój profil to ${hdProfile}. Wpływa on na Twoje interakcje w następujący sposób... (tutaj będzie dynamiczny opis dla ${hdProfile})`;

  return (
    <CosmicCard variant="default" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🎭 Human Design
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple">
            {type === "Generator Manifestujący" ? "GM" : type.substring(0, 2)}
          </Badge>
          <Badge variant="outline" className="bg-cosmic-blue/20 border-cosmic-blue/30 text-cosmic-blue">
            {hdProfile}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">⚡ {type}</h3>
            <CopyButton text={typeDescription} label="Strategia" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {typeDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Budowniczy</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Energia</Badge>
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Magnetyzm</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-pink">🎯 Autorytet {authority}</h4>
              <CopyButton text={authorityDescription} label="Autorytet" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {authorityDescription}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-cosmic-teal">👑 Profil {hdProfile}</h4>
              <CopyButton text={profileDescription} label="Profil" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profileDescription}
            </p>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}
