import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Sparkles, Mail, Brain, Users, CalendarDays, BookOpen, MessageSquareText, MemoryStick, Settings, BellRing, Award, Globe } from 'lucide-react';

interface PricingPageProps {
  onChooseFreePlan: () => void;
  onChoosePaidPlan: () => void;
}

export function PricingPage({ onChooseFreePlan, onChoosePaidPlan }: PricingPageProps) {
  const features = {
    free: [
      { text: "Podstawowa analiza profilu (lokalnie)", icon: Sparkles },
      { text: "Ograniczony dostęp do asystentów AI (podstawowe modele)", icon: Brain },
      { text: "Brak pamięci rozmów AI", icon: MemoryStick },
      { text: "Brak personalizacji i testów", icon: Settings },
      { text: "Brak codziennych powiadomień e-mail", icon: BellRing },
      { text: "Brak dostępu do ekspertów", icon: Award },
    ],
    daily: [
      { text: "Pełna analiza profilu (chmura)", icon: Globe },
      { text: "Dostęp do wszystkich asystentów AI (najlepsze modele)", icon: Brain },
      { text: "Pamięć rozmów AI", icon: MemoryStick },
      { text: "Pełna personalizacja i testy", icon: Settings },
      { text: "Codzienne powiadomienia e-mail (rytm dnia, zadania)", icon: BellRing },
      { text: "Brak dostępu do ekspertów", icon: Award },
    ],
    monthly: [
      { text: "Wszystko z planu Dziennego", icon: CheckCircle },
      { text: "Priorytetowy dostęp do nowych funkcji", icon: Sparkles },
      { text: "Dostęp do katalogu ekspertów i przewodników", icon: Users },
      { text: "Wsparcie premium", icon: Mail },
    ],
  };

  const renderFeature = (feature: { text: string; icon: React.ElementType }, included: boolean) => {
    const IconComponent = feature.icon;
    return (
      <li key={feature.text} className="flex items-center gap-2 text-sm">
        {included ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        <IconComponent className={included ? "h-4 w-4 text-cosmic-gold" : "h-4 w-4 text-cosmic-starlight/50"} />
        <span className={included ? "text-cosmic-starlight" : "text-cosmic-starlight/50 line-through"}>
          {feature.text}
        </span>
      </li>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-cosmic p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-cosmic-gold mb-4">Wybierz Swój Kosmiczny Plan</h1>
        <p className="text-xl text-cosmic-light max-w-2xl mx-auto">
          Odkryj pełnię swojego potencjału z CosmoFlow. Wybierz plan, który najlepiej odpowiada Twojej podróży.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* Free Plan */}
        <Card className="cosmic-card bg-cosmic-dark/70 border-cosmic-purple/30 flex flex-col">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl text-cosmic-gold">Darmowy</CardTitle>
            <CardDescription className="text-cosmic-starlight">Zacznij swoją podróż</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-cosmic-light">0 PLN</span>
              <span className="text-cosmic-starlight">/ zawsze</span>
            </div>
            <ul className="space-y-2">
              {features.free.map(f => renderFeature(f, true))}
              {features.daily.filter(f => !features.free.some(freeF => freeF.text === f.text)).map(f => renderFeature(f, false))}
              {features.monthly.filter(f => !features.daily.some(dailyF => dailyF.text === f.text) && !features.free.some(freeF => freeF.text === f.text)).map(f => renderFeature(f, false))}
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
            <Button onClick={onChooseFreePlan} className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80">
              <Sparkles className="h-4 w-4 mr-2" />
              Kontynuuj z Darmowym
            </Button>
          </CardFooter>
        </Card>

        {/* Daily Plan */}
        <Card className="cosmic-card bg-cosmic-dark/70 border-cosmic-gold/30 flex flex-col relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cosmic-gold text-cosmic-dark px-3 py-1 rounded-full text-xs font-bold">Najpopularniejszy</Badge>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl text-cosmic-gold">Dzienny</CardTitle>
            <CardDescription className="text-cosmic-starlight">Głębokie wglądy na każdy dzień</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-cosmic-light">3 PLN</span>
              <span className="text-cosmic-starlight">/ dzień</span>
            </div>
            <ul className="space-y-2">
              {features.daily.map(f => renderFeature(f, true))}
              {features.monthly.filter(f => !features.daily.some(dailyF => dailyF.text === f.text)).map(f => renderFeature(f, false))}
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
            <Button onClick={onChoosePaidPlan} disabled className="w-full bg-cosmic-gold hover:bg-cosmic-gold/80 text-cosmic-dark">
              <Brain className="h-4 w-4 mr-2" />
              Wybierz Plan Dzienny (Wkrótce)
            </Button>
          </CardFooter>
        </Card>

        {/* Monthly Plan */}
        <Card className="cosmic-card bg-cosmic-dark/70 border-cosmic-blue/30 flex flex-col">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl text-cosmic-gold">Miesięczny</CardTitle>
            <CardDescription className="text-cosmic-starlight">Pełnia kosmicznej mądrości</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-cosmic-light">49 PLN</span>
              <span className="text-cosmic-starlight">/ miesiąc</span>
            </div>
            <ul className="space-y-2">
              {features.monthly.map(f => renderFeature(f, true))}
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
            <Button onClick={onChoosePaidPlan} disabled className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80">
              <Users className="h-4 w-4 mr-2" />
              Wybierz Plan Miesięczny (Wkrótce)
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10 text-center text-cosmic-starlight">
        <p>Masz już konto? <Link to="/auth" className="text-cosmic-gold hover:underline">Zaloguj się</Link></p>
      </div>
    </div>
  );
}
