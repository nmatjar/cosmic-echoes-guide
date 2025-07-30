import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { toast } from "sonner";

interface PromptConfig {
  detailLevel: number;
  focusAreas: string[];
  aiModel: string;
  personalityType: string;
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

export function SmartPromptGenerator() {
  const [config, setConfig] = useState<PromptConfig>({
    detailLevel: 3,
    focusAreas: ["duchowość", "kariera"],
    aiModel: "chatgpt",
    personalityType: "intuitive"
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFocusAreaChange = (areaId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: checked 
        ? [...prev.focusAreas, areaId]
        : prev.focusAreas.filter(id => id !== areaId)
    }));
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const detailLevels = {
      1: "podstawowe",
      2: "rozszerzone", 
      3: "szczegółowe",
      4: "eksperckie",
      5: "mistrzowskie"
    };

    const selectedAreas = config.focusAreas.map(id => 
      focusAreaOptions.find(area => area.id === id)?.label
    ).filter(Boolean);

    const personalityDesc = personalityTypes.find(p => p.value === config.personalityType)?.description;

    const prompt = `🌟 KOSMICZNY PORTRET DUSZY - SPERSONALIZOWANY PROMPT

Jesteś ekspertem w systemach samopoznania na poziomie ${detailLevels[config.detailLevel]}.

👤 PROFIL OSOBY (z Kosmicznego Portretu):
• ♓ Słońce i Ascendent w Rybach: Empatyczna, intuicyjna, artystyczna
• 🔢 Numerologia 33: Mistrz służby, nauczyciel, uzdrowiciel  
• 🐕 Pies/Koza: Lojalna, sprawiedliwa, delikatna, odporna
• ⚡ Generator Manifestujący 6/2: Wzorzec dla innych, autorytet witalny
• 🏛️ 4 Żółta Gwiazda/Wojownik: Harmonia ciało-duch

🎯 OBSZARY FOCUS: ${selectedAreas.join(', ')}
🧠 TYP OSOBOWOŚCI: ${config.personalityType} (${personalityDesc})

📋 INSTRUKCJE DLA ${config.aiModel.toUpperCase()}:
${config.detailLevel >= 3 ? '• Używaj konkretnych przykładów i praktycznych wskazówek' : '• Odpowiadaj zwięźle i praktycznie'}
${config.detailLevel >= 4 ? '• Łącz różne systemy w spójną interpretację' : ''}
${config.detailLevel === 5 ? '• Uwzględniaj zaawansowane aspekty i subtelności' : ''}
• Skup się na obszarach: ${selectedAreas.join(', ')}
• Dostosuj styl do typu ${config.personalityType}
• Dawaj konkretne, wykonalne rady

❓ GŁÓWNE PYTANIE:
Jak mogę wykorzystać swoją unikalną kombinację cech (Ryby 33, Pies/Koza, GM 6/2, Żółta Gwiazda) w kontekście ${selectedAreas.join(' i ')}? 

Uwzględnij mój ${config.personalityType} sposób myślenia i daj mi ${detailLevels[config.detailLevel]} wskazówki.`;

    setGeneratedPrompt(prompt);
    setIsGenerating(false);
    
    toast.success("✨ Spersonalizowany prompt wygenerowany!", {
      description: "Gotowy do użycia z AI",
      duration: 3000
    });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("🌟 Prompt skopiowany do gwiezdnego schowka!", {
      description: "Wklej go do swojego AI",
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
          Stwórz unikalny prompt AI dostosowany do Twojego kosmicznego profilu
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
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
            className="w-full"
          />
          <div className="flex justify-between text-xs text-cosmic-starlight">
            <span>Podstawowy</span>
            <span>Mistrzowski</span>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">
            Obszary zainteresowania:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {focusAreaOptions.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={area.id}
                  checked={config.focusAreas.includes(area.id)}
                  onCheckedChange={(checked) => handleFocusAreaChange(area.id, !!checked)}
                  className="border-cosmic-purple data-[state=checked]:bg-cosmic-purple"
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
          <label className="text-sm font-medium text-cosmic-gold">
            Typ osobowości:
          </label>
          <Select value={config.personalityType} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, personalityType: value }))
          }>
            <SelectTrigger className="border-cosmic-purple/30 bg-cosmic-purple/10 text-cosmic-starlight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {personalityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Model */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cosmic-gold">
            Model AI:
          </label>
          <Select value={config.aiModel} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, aiModel: value }))
          }>
            <SelectTrigger className="border-cosmic-purple/30 bg-cosmic-purple/10 text-cosmic-starlight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chatgpt">ChatGPT (OpenAI)</SelectItem>
              <SelectItem value="claude">Claude (Anthropic)</SelectItem>
              <SelectItem value="gemini">Gemini (Google)</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generatePrompt}
          disabled={isGenerating || config.focusAreas.length === 0}
          className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generowanie magii...
            </>
          ) : (
            <>
              ✨ Generuj Spersonalizowany Prompt
            </>
          )}
        </Button>

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cosmic-gold">
                Twój spersonalizowany prompt:
              </label>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold">
                  {config.focusAreas.length} obszarów
                </Badge>
                <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple">
                  Poziom {config.detailLevel}
                </Badge>
              </div>
            </div>
            
            <Textarea
              value={generatedPrompt}
              readOnly
              className="min-h-[200px] font-mono text-sm bg-cosmic-purple/10 border-cosmic-purple/30 text-cosmic-starlight resize-none"
            />
            
            <div className="flex gap-2">
              <Button onClick={copyPrompt} variant="outline" className="flex-1">
                📋 Kopiuj Prompt
              </Button>
              <CopyButton text={generatedPrompt} label="Backup Copy" />
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-cosmic-blue mb-2">💡 Jak używać:</h4>
          <ul className="text-xs text-cosmic-starlight space-y-1">
            <li>• Skopiuj wygenerowany prompt</li>
            <li>• Wklej go do wybranego AI ({config.aiModel})</li>
            <li>• Możesz dodać własne pytania na końcu</li>
            <li>• Eksperymentuj z różnymi konfiguracjami</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
