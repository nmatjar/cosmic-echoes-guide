import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import elementalData from "@/engine/data/elementalBalance.json";

interface ElementalBalanceSectionProps {
  profile: UserProfile | null;
}

export function ElementalBalanceSection({ profile }: ElementalBalanceSectionProps) {
  if (!profile || !profile.analysis.elementalBalance) {
    return (
      <CosmicCard variant="aurora" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Równowaga Żywiołów</h2>
        <p className="text-muted-foreground">Brak danych o równowadze żywiołów. Utwórz profil, aby zobaczyć analizę.</p>
      </CosmicCard>
    );
  }

  const { fire, earth, metal, water, wood, dominantElements, weakElements } = profile.analysis.elementalBalance;

  const elementsWithScores = [
    { name: "Ogień", score: fire, icon: "🔥" },
    { name: "Ziemia", score: earth, icon: "🌍" },
    { name: "Metal", score: metal, icon: "⚙️" },
    { name: "Woda", score: water, icon: "💧" },
    { name: "Drewno", score: wood, icon: "🌳" },
  ].sort((a, b) => b.score - a.score); // Sort by score descending

  const getElementAssociations = (elementName: string) => {
    const element = elementalData.elements.find(e => e.name === elementName);
    return element ? element.associations : null;
  };

  return (
    <CosmicCard variant="aurora" className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        ☯️🌳 Równowaga Żywiołów
      </h2>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cosmic-gold">Twoje Żywioły</h3>
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

      {dominantElements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-cosmic-gold">Dominujące Żywioły</h3>
          <div className="flex flex-wrap gap-2">
            {dominantElements.map((elementName) => {
              const associations = getElementAssociations(elementName);
              return associations ? (
                <Badge key={elementName} variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold p-3">
                  <span className="font-semibold">{elementName}</span>
                  <ul className="text-xs mt-1 list-disc list-inside">
                    <li>Kierunek: {associations.direction}</li>
                    <li>Pora roku: {associations.season}</li>
                    <li>Emocja: {associations.emotion}</li>
                    <li>Organy: {associations.organ}</li>
                    <li>Cechy: {associations.personalityTraits.join(', ')}</li>
                  </ul>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {weakElements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-cosmic-gold">Słabe Żywioły</h3>
          <div className="flex flex-wrap gap-2">
            {weakElements.map((elementName) => {
              const associations = getElementAssociations(elementName);
              return associations ? (
                <Badge key={elementName} variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink p-3">
                  <span className="font-semibold">{elementName}</span>
                  <ul className="text-xs mt-1 list-disc list-inside">
                    <li>Kierunek: {associations.direction}</li>
                    <li>Pora roku: {associations.season}</li>
                    <li>Emocja: {associations.emotion}</li>
                    <li>Organy: {associations.organ}</li>
                    <li>Cechy: {associations.personalityTraits.join(', ')}</li>
                  </ul>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </CosmicCard>
  );
}
