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

  // Effect for real-time current day update
  useEffect(() => {
    const updateCurrentBioRhythms = async () => {
      const result = await calculateAndSetBioRhythms(new Date());
      if (result) {
        setCurrentBioRhythms(result);
      }
    };

    updateCurrentBioRhythms(); // Initial call
    const interval = setInterval(updateCurrentBioRhythms, 60 * 1000); // Update every minute

    return () => clearInterval(interval);
  }, [profile]);

  // Effect for chart data update based on chartMonth
  useEffect(() => {
    const generateChartData = async () => {
      if (!profile?.birthData.date) return;

      const data = [];
      const startOfMonth = new Date(chartMonth.getFullYear(), chartMonth.getMonth(), 1);
      const endOfMonth = new Date(chartMonth.getFullYear(), chartMonth.getMonth() + 1, 0);

      for (let d = startOfMonth; d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const result = await calculateAndSetBioRhythms(d);
        if (result) {
          data.push({
            name: format(d, 'dd.MM'),
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

  const handlePrevMonth = () => {
    setChartMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setChartMonth(prev => addMonths(prev, 1));
  };

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
      case 'high': return 'bg-cosmic-teal/20 text-cosmic-teal';
      case 'low': return 'bg-cosmic-pink/20 text-cosmic-pink';
      case 'critical': return 'bg-cosmic-gold/20 text-cosmic-gold';
      default: return 'bg-cosmic-purple/20 text-cosmic-purple';
    }
  };

  return (
    <CosmicCard variant="default" className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        🧬⏰ Bio-Rytmy
      </h2>

      {currentBioRhythms && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-cosmic-gold">Dzisiejsze Wpływy ({format(new Date(), 'dd.MM.yyyy')})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(currentBioRhythms.physical.phase)}`}>
              <span className="text-lg font-semibold">Fizyczny</span>
              <span className="text-sm">{biorhythmData.phases[currentBioRhythms.physical.phase]}</span>
            </Badge>
            <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(currentBioRhythms.emotional.phase)}`}>
              <span className="text-lg font-semibold">Emocjonalny</span>
              <span className="text-sm">{biorhythmData.phases[currentBioRhythms.emotional.phase]}</span>
            </Badge>
            <Badge className={`flex flex-col items-center justify-center p-4 h-auto ${getPhaseColor(currentBioRhythms.intellectual.phase)}`}>
              <span className="text-lg font-semibold">Intelektualny</span>
              <span className="text-sm">{biorhythmData.phases[currentBioRhythms.intellectual.phase]}</span>
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cosmic-gold">Wykres Bio-Rytmów ({format(chartMonth, 'MMMM yyyy')})</h3>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ArrowLeft className="h-4 w-4" /> Poprzedni
          </Button>
          <span className="text-lg font-semibold text-foreground">{format(chartMonth, 'MMMM yyyy', { locale: pl })}</span>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Następny <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis domain={[-1, 1]} stroke="#888" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = chartData.find(d => d.name === label);
                  return (
                    <div className="bg-cosmic-dark p-2 border border-cosmic-purple rounded-md text-sm">
                      <p className="font-bold text-cosmic-gold">{label} {dataPoint?.isToday && '(Dziś)'}</p>
                      {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                          {entry.name}: {biorhythmData.phases[dataPoint?.[entry.name]?.phase || 'medium']}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="physical" stroke="#8884d8" dot={({ cx, cy, stroke, key, payload }) => (
              <circle key={key} cx={cx} cy={cy} r={payload.isToday ? 6 : 3} fill={payload.isToday ? '#FFD700' : stroke} />
            )} />
            <Line type="monotone" dataKey="emotional" stroke="#82ca9d" dot={({ cx, cy, stroke, key, payload }) => (
              <circle key={key} cx={cx} cy={cy} r={payload.isToday ? 6 : 3} fill={payload.isToday ? '#FFD700' : stroke} />
            )} />
            <Line type="monotone" dataKey="intellectual" stroke="#ffc658" dot={({ cx, cy, stroke, key, payload }) => (
              <circle key={key} cx={cx} cy={cy} r={payload.isToday ? 6 : 3} fill={payload.isToday ? '#FFD700' : stroke} />
            )} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CosmicCard>
  );
}
