import { useState, useEffect } from 'react';
import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/engine/userProfile";
import { BioRhythmModule } from "@/engine/modules/biorhythms";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import biorhythmData from "@/engine/data/biorhythms.json";

interface BioRhythmSectionProps {
  profile: UserProfile | null;
}

export function BioRhythmSection({ profile }: BioRhythmSectionProps) {
  const [currentBioRhythms, setCurrentBioRhythms] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartMonth, setChartMonth] = useState(new Date());
  const bioRhythmModule = new BioRhythmModule();

  const calculateAndSetBioRhythms = async (date: Date) => {
    if (profile?.birthData.date) {
      const birthDate = new Date(profile.birthData.date);
      const result = await bioRhythmModule.calculate({ date: birthDate }, date);
      return { date, ...result };
    }
    return null;
  };

  useEffect(() => {
    const updateCurrentBioRhythms = async () => {
      const result = await calculateAndSetBioRhythms(new Date());
      if (result) {
        setCurrentBioRhythms(result);
      }
    };

    updateCurrentBioRhythms();
    const interval = setInterval(updateCurrentBioRhythms, 60 * 1000);

    return () => clearInterval(interval);
  }, [profile]);

  useEffect(() => {
    const generateChartData = async () => {
      if (!profile?.birthData.date) return;

      const data = [];
      const startOfMonth = new Date(chartMonth.getFullYear(), chartMonth.getMonth(), 1);
      const endOfMonth = new Date(chartMonth.getFullYear(), chartMonth.getMonth() + 1, 0);

      for (let d = new Date(startOfMonth.getTime()); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const result = await calculateAndSetBioRhythms(new Date(d.getTime()));
        if (result) {
          data.push({
            name: format(d, 'dd'),
            physical: result.physical.cycle,
            emotional: result.emotional.cycle,
            intellectual: result.intellectual.cycle,
            isToday: isSameDay(d, new Date()),
          });
        }
      }
      setChartData(data);
    };

    generateChartData();
  }, [profile, chartMonth]);

  const handlePrevMonth = () => setChartMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setChartMonth(prev => addMonths(prev, 1));

  if (!profile || !profile.birthData.date) {
    return (
      <CosmicCard variant="default" className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Bio-Rytmy</h2>
        <p className="text-muted-foreground">Brak danych urodzeniowych. Utwórz profil, aby zobaczyć analizę bio-rytmów.</p>
      </CosmicCard>
    );
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'high': return 'bg-secondary/20 text-secondary-foreground';
      case 'low': return 'bg-accent/20 text-accent-foreground';
      case 'critical': return 'bg-primary/20 text-primary-foreground';
      default: return 'bg-muted';
    }
  };

  const renderCycleInfo = (cycleName: 'physical' | 'emotional' | 'intellectual', icon: string) => {
    if (!currentBioRhythms) return null;
    const cycleData = currentBioRhythms[cycleName];
    const cycleDesc = biorhythmData.cycleDescriptions[cycleName];
    return (
      <div className="p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">{icon} {cycleDesc.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">{cycleDesc.description}</p>
        <Badge className={`mt-2 ${getPhaseColor(cycleData.phase)}`}>
          Faza: {cycleData.phase}
        </Badge>
        <p className="text-xs text-muted-foreground mt-2">{biorhythmData.phases[cycleData.phase]}</p>
      </div>
    );
  };

  return (
    <CosmicCard variant="default" className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        🧬⏰ Bio-Rytmy
      </h2>

      {currentBioRhythms && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary">Dzisiejsze Wpływy ({format(new Date(), 'dd.MM.yyyy')})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderCycleInfo('physical', '💪')}
            {renderCycleInfo('emotional', '❤️')}
            {renderCycleInfo('intellectual', '🧠')}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Poprzedni
          </Button>
          <span className="text-lg font-semibold text-foreground">{format(chartMonth, 'MMMM yyyy', { locale: pl })}</span>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Następny <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={[-1, 1]} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Line type="monotone" dataKey="physical" name="Fizyczny" stroke="hsl(var(--primary))" dot={false} />
            <Line type="monotone" dataKey="emotional" name="Emocjonalny" stroke="hsl(var(--secondary))" dot={false} />
            <Line type="monotone" dataKey="intellectual" name="Intelektualny" stroke="hsl(var(--accent))" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CosmicCard>
  );
}

