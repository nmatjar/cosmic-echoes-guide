import { CosmicCard } from "@/components/ui/cosmic-card";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";

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

  const { sunSign } = profile.analysis.astrology;

  // Placeholder for ascendant as it's not calculated yet
  const ascendantName = "Nieznany";
  const ascendantIcon = "❔";

  const sunInPisces = `Twoja uwaga stale oscyluje pomiędzy fantazją a rzeczywistością. Twoja empatia i współczucie nie mają sobie równych. Przy tak ogromnej wrażliwości możesz łatwo zostać opanowana przez emocje, więc musisz pamiętać, aby pozostać ugruntowaną w sferze materialnej. Uwielbiasz odkrywać swoją bezgraniczną wyobraźnię, w czym pomaga Ci twoja niezwykła kreatywność i wielomówiące sny.`;

  const ascentInPisces = `Ludzie prawdopodobnie opisują Cię jako marzycielskiego i empatycznego. Czasami możesz bujać w obłokach. Jako ostatni znak jesteś nierozerwalnie związany z całą ludzkością. Kiedy ktoś spotyka Cię po raz pierwszy, może wydawać się, że nie zwracasz na niego uwagi, a twój umysł bładzi gdzie indziej.`;

  return (
    <CosmicCard variant="mystical" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {sunSign.icon} Astrologia Zachodnia
        </h2>
        <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink">
          {sunSign.name}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">🌞 Słońce w {sunSign.name}</h3>
            <CopyButton text={sunInPisces} label="Słońce" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {sunInPisces}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Empatia</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Kreatywność</Badge>
            <Badge variant="secondary" className="bg-cosmic-teal/20 text-cosmic-teal">Intuicja</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cosmic-gold">⬆️ Ascendent w {ascendantName}</h3>
            <CopyButton text={ascentInPisces} label="Ascendent" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ascentInPisces}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-cosmic-pink/20 text-cosmic-pink">Marzycielskość</Badge>
            <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-purple">Tajemniczość</Badge>
            <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">Adaptacyjność</Badge>
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}
