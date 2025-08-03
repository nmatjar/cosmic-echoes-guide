import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import mayanData from "@/engine/data/mayan.json";
import { createAIPrompt } from "@/lib/prompts";
import { CopyPromptButton } from "./ui/copy-button";

interface MayanSectionProps {
  profile: UserProfile | null;
}

export function MayanSection({ profile }: MayanSectionProps) {
  if (!profile || !profile.analysis.mayan) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Kalendarz Majów</h2>
        <p className="text-muted-foreground">Brak danych Kalendarza Majów. Utwórz profil, aby zobaczyć analizę.</p>
      </div>
    );
  }

  const { sign, tone } = profile.analysis.mayan;
  
  const signData = mayanData.signs.find(s => s.name === sign);
  const toneData = mayanData.tones.find(t => t.number === tone);

  if (!signData || !toneData) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground">Kalendarz Majów</h2>
        <p className="text-muted-foreground">Nie znaleziono interpretacji dla Kina: {tone} {sign}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🏛️ Kalendarz Majów
        </h2>
        <Badge variant="outline" className="border-primary/30 bg-primary/20 text-primary">
          Kin: {tone} {sign.split(' ')[1]}
        </Badge>
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">{sign}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: signData.description, userProfile: profile, promptType: 'MAYAN_SIGN_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {signData.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {signData.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary">Ton {toneData.number} - {toneData.name}</h3>
          <CopyPromptButton promptText={createAIPrompt({ mainContent: toneData.description, userProfile: profile, promptType: 'MAYAN_TONE_DESCRIPTION' })} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {toneData.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {toneData.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/20 text-secondary-foreground">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}


