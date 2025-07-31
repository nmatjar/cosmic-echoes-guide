import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserProfile } from "@/engine/userProfile";
import { createAIPrompt } from "@/lib/prompts";

interface SmartPromptGeneratorProps {
  currentProfile: UserProfile | null;
}

interface PromptConfig {
  detailLevel: number;
  focusAreas: string[];
  personalityType: string;
  question: string;
}

const focusAreaOptions = [
  { id: "kariera", label: "Kariera i Zawód", icon: "💼" },
  { id: "związki", label: "Związki i Miłość", icon: "💕" },
  { id: "zdrowie", label: "Zdrowie i Energia", icon: "🌿" },
  { id: "duchowość", label: "Duchowość i Rozwój", icon: "🧘" },
  { id: "finanse", label: "Finanse i Stabilność", icon: "💰" },
  { id: "kreatywność", label: "Kreatywność i Sztuka", icon: "🎨" }
];

const personalityTypes = [
  { value: "analytical", label: "Analityczny", description: "Lubię fakty i logiczne wnioski" },
  { value: "intuitive", label: "Intuicyjny", description: "Ufam przeczuciom i energii" },
  { value: "practical", label: "Praktyczny", description: "Chcę konkretne, wykonalne rady" },
  { value: "spiritual", label: "Duchowy", description: "Szukam głębszego znaczenia" }
];

export function SmartPromptGenerator({ currentProfile }: SmartPromptGeneratorProps) {
  const [config, setConfig] = useState<PromptConfig>({
    detailLevel: 3,
    focusAreas: ["duchowość", "kariera"],
    personalityType: "intuitive",
    question: "Jak mogę najlepiej wykorzystać moje unikalne talenty w wybranych obszarach?"
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const handleFocusAreaChange = (areaId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: checked 
        ? [...prev.focusAreas, areaId]
        : prev.focusAreas.filter(id => id !== areaId)
    }));
  };

  const generatePrompt = () => {
    if (!currentProfile) {
      toast.error("Brak profilu", { description: "Nie można wygenerować promptu bez aktywnego profilu." });
      return;
    }

    const selectedAreas = config.focusAreas.map(id => 
      focusAreaOptions.find(area => area.id === id)?.label
    ).filter(Boolean);

    const prompt = createAIPrompt({
      mainContent: config.question,
      userProfile: currentProfile,
      promptType: 'GENERAL_ANALYSIS',
      smartPromptConfig: {
        detailLevel: config.detailLevel,
        focusAreas: selectedAreas,
        personalityType: config.personalityType
      }
    });

    setGeneratedPrompt(prompt);
    
    toast.success("✨ Spersonalizowany prompt wygenerowany!", {
      description: "Gotowy do użycia z Twoim ulubionym AI.",
      duration: 3000
    });
  };

  const copyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("🌟 Prompt skopiowany do schowka!", {
      description: "Wklej go do swojego AI i odkryj magię.",
      duration: 3000
    });
  };

  return (
    <Card className="cosmic-card bg-gradient-mystical border-cosmic-purple/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cosmic-gold">
          🤖 Generator Spersonalizowanego Promptu
        </CardTitle>
        <CardDescription className="text-cosmic-starlight">
          Stwórz unikalny prompt dla AI, idealnie dostosowany do Twojego kosmicznego profilu.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Custom Question */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">Twoje Główne Pytanie</label>
          <Textarea 
            value={config.question}
            onChange={(e) => setConfig(prev => ({ ...prev, question: e.target.value }))}
            placeholder="Np. Jakie kroki powinienem podjąć w najbliższym roku?"
            className="bg-cosmic-purple/10 border-cosmic-purple/30 text-cosmic-starlight"
          />
        </div>

        {/* Detail Level Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">
            Poziom szczegółowości: {config.detailLevel}/5
          </label>
          <Slider
            value={[config.detailLevel]}
            onValueChange={(value) => setConfig(prev => ({ ...prev, detailLevel: value[0] }))}
            max={5}
            min={1}
            step={1}
          />
        </div>

        {/* Focus Areas */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">Obszary zainteresowania</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {focusAreaOptions.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={area.id}
                  checked={config.focusAreas.includes(area.id)}
                  onCheckedChange={(checked) => handleFocusAreaChange(area.id, !!checked)}
                />
                <label htmlFor={area.id} className="text-sm text-cosmic-starlight flex items-center gap-1 cursor-pointer">
                  <span>{area.icon}</span>
                  {area.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">Preferowany styl odpowiedzi</label>
          <Select value={config.personalityType} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, personalityType: value }))
          }>
            <SelectTrigger className="border-cosmic-purple/30 bg-cosmic-purple/10 text-cosmic-starlight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {personalityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} - <span className="text-xs text-muted-foreground">{type.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generatePrompt}
          disabled={!currentProfile || config.focusAreas.length === 0}
          className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300 text-white"
        >
          ✨ Generuj Spersonalizowany Prompt
        </Button>

        {generatedPrompt && (
          <div className="space-y-3 pt-4 border-t border-cosmic-purple/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cosmic-gold">
                Gotowy do wklejenia do AI:
              </label>
              <Button onClick={copyPrompt} variant="ghost" size="sm">
                📋 Kopiuj
              </Button>
            </div>
            <Textarea
              value={generatedPrompt}
              readOnly
              className="min-h-[200px] font-mono text-xs bg-cosmic-dark/50 border-cosmic-purple/30 text-cosmic-starlight resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

