import { Badge } from "@/components/ui/badge";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { CopyButton } from "@/components/ui/copy-button";
import { UserProfile } from "@/engine/userProfile";

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

  const signDescription = `Jesteś ${sign}. Twoje cechy to... (tutaj będzie dynamiczny opis dla ${sign})`;
  const toneDescription = `Twój ton to ${tone}. Wpływa on na Twoją osobowość w następujący sposób... (tutaj będzie dynamiczny opis dla tonu ${tone})`;

  return (
    <CosmicCard variant="mystical" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🏛️ Kalendarz Majów
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold">
            Kin {tone}
          </Badge>
          <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold">
            {sign}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">⭐ Ton {tone}</h3>
            <CopyButton text={toneDescription} label={`Ton ${tone}`} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {toneDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-gold/20 text-cosmic-gold">Harmonia</Badge>
            <Badge variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink">Uzdrowienie</Badge>
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Autentyczność</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">⚔️ {sign}</h3>
            <CopyButton text={signDescription} label={sign} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {signDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-gold/20 text-cosmic-gold">Wolność</Badge>
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Odwaga</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Mistycyzm</Badge>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}
