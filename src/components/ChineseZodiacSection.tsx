import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import chineseZodiacData from "@/engine/data/chineseZodiac.json";
import { createAIPrompt } from "@/lib/prompts";
import { CopyPromptButton } from "./ui/copy-button";

interface ChineseZodiacSectionProps {
  profile: UserProfile | null;
}

export function ChineseZodiacSection({ profile }: ChineseZodiacSectionProps) {
  if (!profile || !profile.analysis.chineseZodiac) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Horoskop Chiński</h2>
        <p className="text-muted-foreground">Brak danych chińskiego zodiaku. Utwórz profil, aby zobaczyć analizę.</p>
      </div>
    );
  }

  const { animal, icon, element } = profile.analysis.chineseZodiac;
  const animalData = chineseZodiacData.animals.find(a => a.name === animal);

  if (!animalData) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Horoskop Chiński</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla zwierzęcia {animal}.</p>
      </div>
    );
  }

  const { description, strengths, weaknesses } = animalData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {icon} Horoskop Chiński
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary">
            {icon} {animal}
          </Badge>
          <Badge variant="outline" className="border-secondary/30 bg-secondary/20 text-secondary">
            {element}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{icon} {animal} - Opis</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: description, userProfile: profile, promptType: 'CHINESE_ZODIAC_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">☀️ Mocne strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: strengths.join(', '), userProfile: profile, promptType: 'CHINESE_ZODIAC_STRENGTHS' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <Badge key={index} variant="secondary">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-accent">🌑 Słabe strony</h4>
            <CopyPromptButton promptText={createAIPrompt({ mainContent: weaknesses.join(', '), userProfile: profile, promptType: 'CHINESE_ZODIAC_WEAKNESSES' })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((weakness, index) => (
              <Badge key={index} variant="destructive">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


