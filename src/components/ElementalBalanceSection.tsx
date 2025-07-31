import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import elementalData from "@/engine/data/elementalBalance.json";
import { CopyButton } from "./ui/copy-button";

interface ElementalBalanceSectionProps {
  profile: UserProfile | null;
}

export function ElementalBalanceSection({ profile }: ElementalBalanceSectionProps) {
  if (!profile || !profile.analysis?.elementalBalance) {
    return (
      <CosmicCard variant="aurora" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Równowaga Żywiołów</h2>
        <p className="text-muted-foreground">Brak danych o równowadze żywiołów. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const elementalBalance = profile.analysis.elementalBalance as any;
  const { fire, earth, metal, water, wood, dominantElements, weakElements } = elementalBalance;

  const elementsWithScores = [
    { name: "Ogień", score: fire, icon: "🔥" },
    { name: "Ziemia", score: earth, icon: "🌍" },
    { name: "Metal", score: metal, icon: "⚙️" },
    { name: "Woda", score: water, icon: "💧" },
    { name: "Drewno", score: wood, icon: "🌳" },
  ].sort((a, b) => b.score - a.score);

  const getElementData = (elementName: string) => {
    return elementalData.elements.find(e => e.name === elementName);
  };

  return (
    <CosmicCard variant="aurora" className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        ☯️🌳 Równowaga Żywiołów
      </h2>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cosmic-gold">Twoja Punktacja Żywiołów</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {elementsWithScores.map((el) => (
            <Badge
              key={el.name}
              className={`flex flex-col items-center justify-center p-4 h-auto ${el.score > 0 ? 'bg-cosmic-teal/20 text-cosmic-teal' : 'bg-gray-700/20 text-gray-400'}`}
            >
              <span className="text-2xl">{el.icon}</span>
              <span className="text-lg font-semibold">{el.name}</span>
              <span className="text-sm">Siła: {el.score}</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {dominantElements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cosmic-gold">Dominujący Żywioł: {dominantElements.join(', ')}</h3>
              <CopyButton text={getElementData(dominantElements[0])?.interpretations.dominant || ''} label="Dominujący Żywioł" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getElementData(dominantElements[0])?.interpretations.dominant}
            </p>
          </div>
        )}

        {weakElements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cosmic-pink">Słaby Żywioł: {weakElements.join(', ')}</h3>
              <CopyButton text={getElementData(weakElements[0])?.interpretations.weak || ''} label="Słaby Żywioł" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getElementData(weakElements[0])?.interpretations.weak}
            </p>
          </div>
        )}
      </div>
    </CosmicCard>
  );
}

