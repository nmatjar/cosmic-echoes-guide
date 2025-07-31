import { UserProfile } from '@/engine/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Heart, Eye, Share2, TrendingUp } from 'lucide-react';

// Import data for detailed descriptions
import astrologyData from "@/engine/data/astrology.json";
import numerologyData from "@/engine/data/numerology.json";
import chineseZodiacData from "@/engine/data/chineseZodiac.json";
import humanDesignData from "@/engine/data/humanDesign.json";

interface ViralPublicProfileProps {
  profile: UserProfile;
  onShare: () => void;
  onCreateProfile: () => void;
}

const ViralPublicProfile = ({ profile, onShare, onCreateProfile }: ViralPublicProfileProps) => {
  // --- Data Retrieval ---
  const astro = profile.analysis.astrology ? astrologyData.sunSigns.find(s => s.name === profile.analysis.astrology.sunSign.name) : null;
  const numero = profile.analysis.numerology ? (numerologyData.lifePathNumber as any)[profile.analysis.numerology.lifePathNumber] : null;
  const cZodiac = profile.analysis.chineseZodiac ? chineseZodiacData.animals.find(a => a.name === profile.analysis.chineseZodiac.animal) : null;
  const hd = profile.analysis.humanDesign ? humanDesignData.types.find(t => t.name === profile.analysis.humanDesign.type) : null;

  // --- Personalized Content Generation (No Randomness) ---
  const getPersonalityInsight = () => {
    if (astro && numero) {
      return `Jako ${astro.name} z Drogą Życia ${profile.analysis.numerology.lifePathNumber}, Twoja ${astro.strengths[0].toLowerCase()} łączy się z darem do bycia ${numero.title.toLowerCase()}. To unikalne połączenie!`;
    }
    return "Masz w sobie unikalną kombinację kosmicznych energii, która czeka na odkrycie.";
  };

  // --- Deterministic "Viral" Stats ---
  const getDeterministicStat = (key: string, max: number) => {
    const charCodes = (profile.id + key).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (charCodes % max) + Math.floor(max / 10);
  };

  const viewCount = getDeterministicStat('views', 500);
  const likes = getDeterministicStat('likes', 100);

  return (
    <div className="space-y-8">
      {/* Viral Stats Bar */}
      <div className="flex items-center justify-between bg-cosmic-dark/50 rounded-lg p-4 border border-cosmic-purple/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cosmic-gold" />
            <span className="text-cosmic-light text-sm">{viewCount.toLocaleString()} wyświetleń</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm text-cosmic-light">{likes} polubień</span>
          </div>
          <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-gold">
            <TrendingUp className="w-3 h-3 mr-1" />
            Popularny Profil
          </Badge>
        </div>
        <Button 
          onClick={onShare}
          size="sm"
          variant="outline"
          className="border-cosmic-purple/50 text-cosmic-light hover:bg-cosmic-purple/20"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Udostępnij
        </Button>
      </div>

      {/* Enhanced Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {astro && (
          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 text-center p-6">
            <div className="text-4xl mb-3">{astro.icon}</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Znak Zodiaku</h3>
            <p className="text-cosmic-light text-lg font-medium">{astro.name}</p>
            <p className="text-xs text-cosmic-light/70 mt-2 h-8">"{astro.description.substring(0, 40)}..."</p>
          </Card>
        )}
        {numero && (
          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 text-center p-6">
            <div className="text-4xl mb-3">🔢</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Droga Życia</h3>
            <p className="text-cosmic-light text-lg font-medium">{profile.analysis.numerology.lifePathNumber}</p>
            <p className="text-xs text-cosmic-light/70 mt-2 h-8">Tytuł: {numero.title}</p>
          </Card>
        )}
        {cZodiac && (
          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 text-center p-6">
            <div className="text-4xl mb-3">{cZodiac.icon}</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Zodiak Chiński</h3>
            <p className="text-cosmic-light text-lg font-medium">{cZodiac.name}</p>
            <p className="text-xs text-cosmic-light/70 mt-2 h-8">Kluczowa cecha: {cZodiac.strengths[0]}</p>
          </Card>
        )}
        {hd && (
          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 text-center p-6">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Human Design</h3>
            <p className="text-cosmic-light text-lg font-medium">{hd.name}</p>
            <p className="text-xs text-cosmic-light/70 mt-2 h-8">Strategia: {hd.strategy}</p>
          </Card>
        )}
      </div>

      {/* Personality Insight Card */}
      <Card className="bg-gradient-to-br from-cosmic-purple/20 to-cosmic-gold/20 border-cosmic-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-gold">
            <Sparkles className="w-5 h-5" />
            Twój Osobisty Wgląd
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-light text-lg italic">"{getPersonalityInsight()}"</p>
        </CardContent>
      </Card>

      {/* Viral CTA Section */}
      <Card className="bg-gradient-to-r from-cosmic-purple/30 to-cosmic-gold/30 border-cosmic-gold/50">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-gold mb-2">
                Odkryj PEŁNY obraz swojej kosmicznej natury!
              </h2>
              <p className="text-cosmic-light text-lg max-w-2xl mx-auto">
                To tylko fragment Twojego Kosmicznego Portretu. Stwórz darmowy profil, aby uzyskać dostęp do wszystkich 7 systemów, codziennych prognoz i szczegółowych analiz.
              </p>
            </div>
            
            <Button 
              onClick={onCreateProfile}
              size="lg"
              className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white text-lg px-8 py-4 shadow-lg shadow-cosmic-purple/20 transform hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Stwórz Swój Darmowy Profil
            </Button>

            <p className="text-cosmic-light/70 text-sm">
              Dołącz do tysięcy osób, które już odkryły swój kosmiczny kod!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViralPublicProfile;