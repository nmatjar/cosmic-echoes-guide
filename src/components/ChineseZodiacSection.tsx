import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { CopyButton } from "@/components/ui/copy-button";
import { UserProfile } from "@/engine/userProfile";

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

  const animalDescription = `Jesteś ${animal} w chińskim zodiaku. Twoje cechy to... (tutaj będzie dynamiczny opis dla ${animal})`;
  const elementDescription = `Twój element to ${element}. Wpływa on na Twoją osobowość w następujący sposób... (tutaj będzie dynamiczny opis dla ${element})`;

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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">{icon} {animal} Roczny</h3>
            <CopyButton text={animalDescription} label={animal} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {animalDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink">Lojalność</Badge>
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Uczciwość</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Niezawodność</Badge>
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Sprawiedliwość</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">Element {element}</h3>
            <CopyButton text={elementDescription} label={element} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {elementDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink">Elastyczność</Badge>
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Stabilność</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Siła</Badge>
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Kreatywność</Badge>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}
