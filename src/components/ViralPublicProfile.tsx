import { useState, useEffect } from 'react';
import { UserProfile } from '@/engine/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Zap, 
  Moon, 
  Sun, 
  Crown, 
  Flame, 
  Waves, 
  Mountain,
  Heart,
  Eye,
  Share2,
  Sparkles,
  Users,
  TrendingUp,
  Gift,
  Lock,
  Unlock
} from 'lucide-react';

interface ViralPublicProfileProps {
  profile: UserProfile;
  onShare: () => void;
  onCreateProfile: () => void;
}

const ViralPublicProfile = ({ profile, onShare, onCreateProfile }: ViralPublicProfileProps) => {
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 500) + 100);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);

  // Animowane liczniki
  useEffect(() => {
    const timer = setTimeout(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [viewCount]);

  const revealSecret = (secretId: string) => {
    setRevealedSecrets(prev => new Set([...prev, secretId]));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const getPersonalityInsight = () => {
    const insights = [
      "Twoja energia przyciąga ludzi jak magnes kosmiczny ✨",
      "Masz wyjątkową zdolność do transformacji trudnych sytuacji 🔮",
      "Twoja intuicja jest silniejsza niż myślisz 🌙",
      "Jesteś naturalnym liderem, nawet jeśli tego nie dostrzegasz 👑",
      "Twoja kreatywność może zmienić świat 🎨",
      "Masz dar do uzdrawiania innych swoją obecnością 💫"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getCompatibilityHint = () => {
    const hints = [
      "Najlepiej dogadujesz się z osobami urodzonymi w środy 🌟",
      "Twoja idealna para ma w numerologii liczbę 7 💕",
      "Znaki Ziemi są dla Ciebie szczególnie wspierające 🌍",
      "Osoby z Human Design Projektora będą Cię inspirować ⚡",
      "Twoja energia harmonizuje z ludźmi urodzonych jesienią 🍂"
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  };

  const getLuckyElement = () => {
    const elements = [
      { name: "Kryształ Ametystu", icon: "💎", power: "Intuicja" },
      { name: "Złoty Amulet", icon: "🏆", power: "Sukces" },
      { name: "Srebrny Księżyc", icon: "🌙", power: "Mądrość" },
      { name: "Płomień Pasji", icon: "🔥", power: "Energia" },
      { name: "Morska Perła", icon: "🌊", power: "Spokój" }
    ];
    return elements[Math.floor(Math.random() * elements.length)];
  };

  const getZodiacSign = () => profile?.analysis?.astrology?.sign || 'Nieznany';
  const getLifePathNumber = () => profile?.analysis?.numerology?.lifePathNumber || 'Nieznana';
  const getChineseZodiac = () => profile?.analysis?.chineseZodiac?.animal || 'Nieznane';
  const getHumanDesignType = () => profile?.analysis?.humanDesign?.type || 'Nieznany';

  const personalityInsight = getPersonalityInsight();
  const compatibilityHint = getCompatibilityHint();
  const luckyElement = getLuckyElement();

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
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-red-400' : 'text-cosmic-light hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likes}</span>
            </button>
          </div>
          <Badge variant="secondary" className="bg-cosmic-purple/20 text-cosmic-gold">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
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

      {/* Enhanced Key Insights with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 hover:border-cosmic-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 group-hover:animate-pulse">♈</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Znak Zodiaku</h3>
            <p className="text-cosmic-light text-lg font-medium">{getZodiacSign()}</p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="outline" className="text-xs border-cosmic-gold/30 text-cosmic-gold">
                Kliknij aby odkryć więcej
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 hover:border-cosmic-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 group-hover:animate-bounce">🔢</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Liczba Życia</h3>
            <p className="text-cosmic-light text-lg font-medium">{getLifePathNumber()}</p>
            <div className="mt-2">
              <Progress value={parseInt(getLifePathNumber().toString()) * 11} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 hover:border-cosmic-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 group-hover:animate-spin">🐉</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Zodiak Chiński</h3>
            <p className="text-cosmic-light text-lg font-medium">{getChineseZodiac()}</p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="outline" className="text-xs border-cosmic-purple/30 text-cosmic-purple">
                Starożytna mądrość
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30 hover:border-cosmic-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 group-hover:animate-pulse">⚡</div>
            <h3 className="text-cosmic-gold font-semibold mb-2">Human Design</h3>
            <p className="text-cosmic-light text-lg font-medium">{getHumanDesignType()}</p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="outline" className="text-xs border-cosmic-gold/30 text-cosmic-gold">
                Nowoczesna nauka
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personality Insight Card */}
      <Card className="bg-gradient-to-br from-cosmic-purple/20 to-cosmic-gold/20 border-cosmic-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-gold">
            <Sparkles className="w-5 h-5" />
            Twój Kosmiczny Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-light text-lg italic mb-4">"{personalityInsight}"</p>
          <div className="flex items-center gap-2 text-sm text-cosmic-light/70">
            <Star className="w-4 h-4 text-cosmic-gold" />
            <span>Wygenerowano na podstawie Twojej unikalnej kombinacji kosmicznych energii</span>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Secrets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compatibility Secret */}
        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cosmic-gold">
              <Heart className="w-5 h-5" />
              Sekret Kompatybilności
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revealedSecrets.has('compatibility') ? (
              <div className="space-y-3">
                <p className="text-cosmic-light">{compatibilityHint}</p>
                <Badge className="bg-cosmic-purple/20 text-cosmic-purple">
                  <Unlock className="w-3 h-3 mr-1" />
                  Odkryte!
                </Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-cosmic-light/70">Odkryj z kim najlepiej się dogadujesz...</p>
                <Button 
                  onClick={() => revealSecret('compatibility')}
                  size="sm"
                  className="bg-cosmic-purple/20 hover:bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/30"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Odkryj sekret
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lucky Element Secret */}
        <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cosmic-gold">
              <Gift className="w-5 h-5" />
              Twój Szczęśliwy Element
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revealedSecrets.has('lucky') ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{luckyElement.icon}</span>
                  <div>
                    <p className="text-cosmic-light font-medium">{luckyElement.name}</p>
                    <p className="text-cosmic-light/70 text-sm">Moc: {luckyElement.power}</p>
                  </div>
                </div>
                <Badge className="bg-cosmic-gold/20 text-cosmic-gold">
                  <Unlock className="w-3 h-3 mr-1" />
                  Odkryte!
                </Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-cosmic-light/70">Poznaj swój magiczny talisman...</p>
                <Button 
                  onClick={() => revealSecret('lucky')}
                  size="sm"
                  className="bg-cosmic-gold/20 hover:bg-cosmic-gold/30 text-cosmic-gold border border-cosmic-gold/30"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Odkryj element
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Viral CTA Section */}
      <Card className="bg-gradient-to-r from-cosmic-purple/30 to-cosmic-gold/30 border-cosmic-gold/50">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-gold mb-2">
                🌟 Chcesz odkryć WSZYSTKIE swoje sekrety? 🌟
              </h2>
              <p className="text-cosmic-light text-lg">
                To dopiero początek! Stwórz swój pełny profil i odkryj:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-cosmic-dark/50 rounded-lg p-4">
                <div className="text-2xl mb-2">🔮</div>
                <p className="text-cosmic-gold font-medium">Szczegółowe prognozy</p>
                <p className="text-cosmic-light/70">Na każdy dzień</p>
              </div>
              <div className="bg-cosmic-dark/50 rounded-lg p-4">
                <div className="text-2xl mb-2">💕</div>
                <p className="text-cosmic-gold font-medium">Analiza związków</p>
                <p className="text-cosmic-light/70">Z każdą osobą</p>
              </div>
              <div className="bg-cosmic-dark/50 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-cosmic-gold font-medium">Przewodnik życiowy</p>
                <p className="text-cosmic-light/70">Spersonalizowany</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onCreateProfile}
                size="lg"
                className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white text-lg px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Stwórz PEŁNY profil GRATIS!
              </Button>
              
              <Button 
                onClick={onShare}
                size="lg"
                variant="outline"
                className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 text-lg px-8 py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                Udostępnij znajomym
              </Button>
            </div>

            <p className="text-cosmic-light/70 text-sm">
              ⏰ Dołącz do <span className="text-cosmic-gold font-medium">10,000+</span> osób, które już odkryły swoje kosmiczne przeznaczenie!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViralPublicProfile;
