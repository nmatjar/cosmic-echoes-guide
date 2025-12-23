import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Sparkles, User, Lock, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pl, enUS, ar } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { AnalysisEngine } from "@/engine";
import { NumerologyModule } from "@/engine/modules/numerology";
import { HumanDesignModule } from "@/engine/modules/humanDesign";
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
  const { t, language, direction, locale } = useTranslation();
  const [step, setStep] = useState<'welcome' | 'birth-data'>('welcome');
  const [birthData, setBirthData] = useState<BirthData>({
    date: undefined,
    time: '',
    place: '',
    name: '',
    pin: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (language) {
      case 'ar': return ar;
      case 'en': return enUS;
      case 'pl': return pl;
      default: return pl;
    }
  };

  const generateCosmicProfile = async () => {
    if (!birthData.date) return;

    setIsGenerating(true);

    // 1. Inicjalizacja silnika i modułów
    const engine = new AnalysisEngine();
    engine.registerModule(new NumerologyModule());
    engine.registerModule(new HumanDesignModule());
    // W przyszłości dodamy tu więcej modułów:
    // engine.registerModule(new MayanModule());
    // engine.registerModule(new AstrologyModule());

    // 2. Uruchomienie analizy
    const analysisResults = await engine.runAnalysis({
      date: birthData.date,
      time: birthData.time,
      place: birthData.place,
    });

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
    
    toast.success("🌟 Twój CosmoFlow Profil został utworzony!", {
      description: `Witaj ${newProfile.name}! Odkryj swój unikalny rytm życia.`,
      duration: 4000
    });
  };

  

  if (step === 'welcome') {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-cosmic p-4 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md cosmic-card bg-gradient-mystical border-cosmic-purple/30">
          <CardHeader className="text-center relative">
            <LanguageSelector className="absolute top-2 right-2" />
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-cosmic-gold">
              {t('welcome.title')}
            </CardTitle>
            <CardDescription className="text-cosmic-starlight">
              {t('welcome.subtitle')} - {t('welcome.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple justify-center py-2">
                {t('welcome.features.astrology')}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold justify-center py-2">
                {t('welcome.features.numerology')}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink justify-center py-2">
                {t('welcome.features.chineseZodiac')}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-teal/20 border-cosmic-teal/30 text-cosmic-teal justify-center py-2">
                {t('welcome.features.humanDesign')}
              </Badge>
            </div>
            
            <div className="bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-cosmic-blue mb-2">{t('welcome.benefits.title')}</h4>
              <ul className="text-xs text-cosmic-starlight space-y-1">
                <li>{t('welcome.benefits.analysis')}</li>
                <li>{t('welcome.benefits.prompts')}</li>
                <li>{t('welcome.benefits.export')}</li>
                <li>{t('welcome.benefits.storage')}</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setStep('birth-data')}
              className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300"
            >
              {t('welcome.startButton')}
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
            <img src="/logo_full.png" alt="Cosmic Echoes Guide Logo" className="w-48 mx-auto mb-4" />
            <CardTitle className="text-xl text-cosmic-gold">
              📅 Dane Urodzenia
            </CardTitle>
            <CardDescription className="text-cosmic-starlight">
              Podaj swoje dane, aby stworzyć spersonalizowany profil kosmiczny
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Imię (opcjonalne)</Label>
              <Input
                id="name"
                placeholder="Jak mamy się do Ciebie zwracać?"
                value={birthData.name}
                onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white text-black"
              />
            </div>

            <div className="space-y-2">
              <Label>Data urodzenia *</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={birthData.date ? format(birthData.date, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const newDate = new Date(dateValue);
                      // Sprawdź czy data jest w dozwolonym zakresie
                      if (newDate <= new Date() && newDate >= new Date("1900-01-01")) {
                        setBirthData(prev => ({ ...prev, date: newDate }));
                      }
                    } else {
                      setBirthData(prev => ({ ...prev, date: undefined }));
                    }
                  }}
                  min="1900-01-01"
                  max={format(new Date(), "yyyy-MM-dd")}
                  className="flex-1 bg-white text-black"
                  placeholder="dd.mm.rrrr"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white text-black border-gray-300 hover:bg-gray-50"
                      type="button"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthData.date}
                      onSelect={(date) => setBirthData(prev => ({ ...prev, date }))}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      defaultMonth={birthData.date || new Date(1990, 0)} // Domyślnie 1990 rok
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Możesz wpisać datę z klawiatury lub użyć kalendarza
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Godzina urodzenia *</Label>
              <Input
                id="time"
                type="time"
                value={birthData.time}
                onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
                className="date-input-fix bg-white text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">Miejsce urodzenia *</Label>
              <Input
                id="place"
                placeholder="Miasto, kraj"
                value={birthData.place}
                onChange={(e) => setBirthData(prev => ({ ...prev, place: e.target.value }))}
                className="bg-white text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                PIN zabezpieczający (4-6 cyfr) *
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                value={birthData.pin}
                onChange={(e) => setBirthData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="text-center text-lg tracking-widest bg-white text-black"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
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
                disabled={!birthData.date || !birthData.time || !birthData.place || !birthData.pin || birthData.pin.length < 4 || isGenerating}
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
