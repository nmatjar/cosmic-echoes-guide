import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Sparkles, User, Lock } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";
import { AnalysisEngine } from "@/engine";
import { NumerologyModule } from "@/engine/modules/numerology";
import { createProfile } from "@/services/profileManager";
import { UserProfile } from "@/engine/userProfile";

interface BirthData {
  date: Date | undefined;
  time: string;
  place: string;
  name: string;
  pin: string;
}

interface CosmicWelcomeProps {
  onProfileCreated: (profile: UserProfile) => void;
}

export function CosmicWelcome({ onProfileCreated }: CosmicWelcomeProps) {
  const [step, setStep] = useState<'welcome' | 'birth-data'>('welcome');
  const [birthData, setBirthData] = useState<BirthData>({
    date: undefined,
    time: '',
    place: '',
    name: '',
    pin: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCosmicProfile = async () => {
    if (!birthData.date) return;

    setIsGenerating(true);

    // 1. Inicjalizacja silnika i modułów
    const engine = new AnalysisEngine();
    engine.registerModule(new NumerologyModule());
    // W przyszłości dodamy tu więcej modułów:
    // engine.registerModule(new MayanModule());
    // engine.registerModule(new AstrologyModule());

    // 2. Uruchomienie analizy
    const analysisResults = await engine.runAnalysis({ date: birthData.date });

    // 3. Stworzenie i zapisanie profilu
    const newProfile = createProfile(
      birthData.name || 'Kosmiczna Dusza',
      birthData.date,
      analysisResults,
      birthData.pin,
      birthData.time || undefined,
      birthData.place || undefined
    );

    setIsGenerating(false);
    onProfileCreated(newProfile);
    
    toast.success("🌟 Twój Kosmiczny Portret został utworzony!", {
      description: `Witaj ${newProfile.name}! Twoja duchowa podróż się rozpoczyna.`,
      duration: 4000
    });
  };

  

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
        <Card className="w-full max-w-md cosmic-card bg-gradient-mystical border-cosmic-purple/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-cosmic-gold">
              ✨ Witaj w Kosmosie ✨
            </CardTitle>
            <CardDescription className="text-cosmic-starlight">
              Odkryj swój unikalny Portret Duszy przez pryzmat starożytnych systemów mądrości
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple justify-center py-2">
                ♓ Astrologia
              </Badge>
              <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold justify-center py-2">
                🔢 Numerologia
              </Badge>
              <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink justify-center py-2">
                🐕 Zodiak Chiński
              </Badge>
              <Badge variant="outline" className="bg-cosmic-teal/20 border-cosmic-teal/30 text-cosmic-teal justify-center py-2">
                ⚡ Human Design
              </Badge>
            </div>
            
            <div className="bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-cosmic-blue mb-2">Co otrzymasz:</h4>
              <ul className="text-xs text-cosmic-starlight space-y-1">
                <li>• Kompleksową analizę osobowości</li>
                <li>• Spersonalizowane prompty AI</li>
                <li>• Eksport do PDF i udostępnianie</li>
                <li>• Bezpieczne przechowywanie profilu</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setStep('birth-data')}
              className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300"
            >
              🚀 Rozpocznij Kosmiczną Podróż
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'birth-data') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
        <Card className="w-full max-w-md cosmic-card bg-gradient-mystical border-cosmic-purple/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cosmic-gold to-cosmic-teal rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-cosmic-gold">
              📅 Dane Urodzenia
            </CardTitle>
            <CardDescription className="text-cosmic-starlight">
              Podaj swoje dane, aby stworzyć spersonalizowany profil kosmiczny
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cosmic-gold">Imię (opcjonalne)</Label>
              <Input
                id="name"
                placeholder="Jak mamy się do Ciebie zwracać?"
                value={birthData.name}
                onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                className="border-cosmic-purple/30 bg-cosmic-purple/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-cosmic-gold">Data urodzenia *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-cosmic-purple/30 bg-cosmic-purple/10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthData.date ? format(birthData.date, "PPP", { locale: pl }) : "Wybierz datę"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthData.date}
                    onSelect={(date) => setBirthData(prev => ({ ...prev, date }))}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1900} // Optional: Set a reasonable start year
                    toYear={new Date().getFullYear()} // Optional: Set current year as end year
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-cosmic-gold">Godzina urodzenia (opcjonalne)</Label>
              <Input
                id="time"
                type="time"
                value={birthData.time}
                onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
                className="border-cosmic-purple/30 bg-cosmic-purple/10"
              />
              <p className="text-xs text-cosmic-starlight">Dla dokładniejszego Human Design</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="place" className="text-cosmic-gold">Miejsce urodzenia (opcjonalne)</Label>
              <Input
                id="place"
                placeholder="Miasto, kraj"
                value={birthData.place}
                onChange={(e) => setBirthData(prev => ({ ...prev, place: e.target.value }))}
                className="border-cosmic-purple/30 bg-cosmic-purple/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-cosmic-gold flex items-center gap-2">
                <Lock className="h-4 w-4" />
                PIN zabezpieczający (4-6 cyfr) *
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                value={birthData.pin}
                onChange={(e) => setBirthData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="border-cosmic-purple/30 bg-cosmic-purple/10 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-cosmic-starlight">
                🔒 PIN będzie wymagany do dostępu do Twojego profilu
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setStep('welcome')}
                className="flex-1"
              >
                ← Wstecz
              </Button>
              <Button 
                onClick={generateCosmicProfile}
                disabled={!birthData.date || !birthData.pin || birthData.pin.length < 4 || isGenerating}
                className="flex-1 bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Tworzenie...
                  </>
                ) : (
                  '✨ Stwórz Profil'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
