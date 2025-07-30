import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CloudProfileManager } from '@/services/cloudProfileManager';
import { UserProfile } from '@/engine/userProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, Eye, Calendar, MapPin, Clock, Sparkles, Heart, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PublicProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const referrerSource = searchParams.get('ref');

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        setError('Nieprawidłowy identyfikator profilu');
        setLoading(false);
        return;
      }

      try {
        // First try to get from cloud
        const publicProfile = await CloudProfileManager.getPublicProfile(profileId);
        
        if (publicProfile) {
          setProfile(publicProfile);
          
          // Track the view (don't fail if this doesn't work)
          try {
            await CloudProfileManager.trackProfileView(profileId, referrerSource || 'direct');
          } catch (trackError) {
            console.warn('Could not track profile view:', trackError);
          }
          
          setLoading(false);
          return;
        }

        // If cloud fails, try to load from localStorage as fallback
        const localProfiles = JSON.parse(localStorage.getItem('cosmoflow_profiles') || '[]') as UserProfile[];
        const localProfile = localProfiles.find((p: UserProfile) => p.id === profileId);
        
        if (localProfile && (localProfile as any).isPublic !== false) {
          setProfile(localProfile);
          setLoading(false);
          return;
        }

        // If neither works, show error
        setError('Profil nie został znaleziony lub jest prywatny');
        
      } catch (err) {
        console.error('Error loading public profile:', err);
        
        // Try localStorage fallback on any error
        try {
          const localProfiles = JSON.parse(localStorage.getItem('cosmoflow_profiles') || '[]') as UserProfile[];
          const localProfile = localProfiles.find((p: UserProfile) => p.id === profileId);
          
          if (localProfile && (localProfile as any).isPublic !== false) {
            setProfile(localProfile);
            setLoading(false);
            return;
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
        
        setError('Funkcja publicznych profili jest obecnie niedostępna. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId, referrerSource]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kosmiczny Portret ${profile?.name}`,
          text: `Odkryj kosmiczny portret ${profile?.name} - analiza astrologiczna, numerologia i więcej!`,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link skopiowany!",
          description: "Link do profilu został skopiowany do schowka.",
        });
      } catch (err) {
        toast({
          title: "Błąd",
          description: "Nie udało się skopiować linku.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateProfile = () => {
    navigate('/?ref=public_profile');
  };

  const getZodiacSign = () => {
    return profile?.analysis?.astrology?.sign || 'Nieznany';
  };

  const getLifePathNumber = () => {
    return profile?.analysis?.numerology?.lifePathNumber || 'Nieznana';
  };

  const getChineseZodiac = () => {
    return profile?.analysis?.chineseZodiac?.animal || 'Nieznane';
  };

  const getHumanDesignType = () => {
    return profile?.analysis?.humanDesign?.type || 'Nieznany';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-purple mx-auto mb-4"></div>
          <p className="text-cosmic-gold text-lg">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
        <Card className="max-w-md w-full bg-cosmic-dark/90 border-cosmic-purple/30">
          <CardHeader className="text-center">
            <CardTitle className="text-cosmic-gold">Profil niedostępny</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-cosmic-light">{error}</p>
            <Button 
              onClick={handleCreateProfile}
              className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Stwórz swój profil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 to-cosmic-gold/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-cosmic-dark/50 px-4 py-2 rounded-full border border-cosmic-purple/30">
              <Sparkles className="w-4 h-4 text-cosmic-gold" />
              <span className="text-cosmic-light text-sm">Kosmiczny Portret</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-cosmic-gold">
              {profile.name}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-cosmic-light">
              {profile.birthData.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(profile.birthData.date).toLocaleDateString('pl-PL')}</span>
                </div>
              )}
              {profile.birthData.place && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.birthData.place}</span>
                </div>
              )}
              {profile.birthData.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{profile.birthData.time}</span>
                </div>
              )}
            </div>

            <Button 
              onClick={handleShare}
              variant="outline"
              className="border-cosmic-purple/50 text-cosmic-light hover:bg-cosmic-purple/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij profil
            </Button>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">♈</div>
              <h3 className="text-cosmic-gold font-semibold mb-1">Znak Zodiaku</h3>
              <p className="text-cosmic-light">{getZodiacSign()}</p>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🔢</div>
              <h3 className="text-cosmic-gold font-semibold mb-1">Liczba Życia</h3>
              <p className="text-cosmic-light">{getLifePathNumber()}</p>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🐉</div>
              <h3 className="text-cosmic-gold font-semibold mb-1">Zodiak Chiński</h3>
              <p className="text-cosmic-light">{getChineseZodiac()}</p>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-dark/90 border-cosmic-purple/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-cosmic-gold font-semibold mb-1">Human Design</h3>
              <p className="text-cosmic-light">{getHumanDesignType()}</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-cosmic-purple/30 mb-12" />

        {/* Call to Action */}
        <div className="text-center space-y-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-cosmic-gold mb-4">
              Odkryj swój własny kosmiczny portret
            </h2>
            <p className="text-cosmic-light text-lg mb-6">
              Poznaj tajemnice swojej osobowości poprzez analizę astrologiczną, numerologię, 
              Human Design i wiele więcej. Stwórz swój unikalny profil już dziś!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleCreateProfile}
                size="lg"
                className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Stwórz swój profil
              </Button>
              
              <Button 
                onClick={handleShare}
                size="lg"
                variant="outline"
                className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10"
              >
                <Heart className="w-5 h-5 mr-2" />
                Poleć znajomym
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-cosmic-purple" />
              </div>
              <h3 className="text-cosmic-gold font-semibold">Kompleksowa Analiza</h3>
              <p className="text-cosmic-light text-sm">
                Astrologia, numerologia, Human Design i więcej systemów w jednym miejscu
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-6 h-6 text-cosmic-purple" />
              </div>
              <h3 className="text-cosmic-gold font-semibold">Łatwe Udostępnianie</h3>
              <p className="text-cosmic-light text-sm">
                Udostępniaj swój profil znajomym przez QR kod, link lub social media
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-cosmic-purple" />
              </div>
              <h3 className="text-cosmic-gold font-semibold">Społeczność</h3>
              <p className="text-cosmic-light text-sm">
                Porównuj profile z znajomymi i odkrywaj kosmiczne połączenia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cosmic-purple/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-cosmic-light/70">
            Powered by <span className="text-cosmic-gold font-semibold">CosmoFlow</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
