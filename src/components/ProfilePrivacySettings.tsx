import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Share2, BarChart3, Users, Globe, Lock, Info } from 'lucide-react';
import { CloudProfileManager } from '@/services/cloudProfileManager';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/engine/userProfile';

interface ProfilePrivacySettingsProps {
  currentProfile?: UserProfile | null;
}

export function ProfilePrivacySettings({ currentProfile }: ProfilePrivacySettingsProps) {
  const [isPublic, setIsPublic] = useState(currentProfile?.isPublic ?? false);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    viewCount: number;
    recentViews: Array<{ viewed_at: string; referrer_source?: string }>;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentProfile) {
      setIsPublic(currentProfile.isPublic ?? false);
      loadAnalytics();
    }
  }, [currentProfile]);

  const loadAnalytics = async () => {
    try {
      const data = await CloudProfileManager.getProfileAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleVisibilityChange = async (newIsPublic: boolean) => {
    if (!currentProfile) {
      toast({
        title: "Błąd",
        description: "Brak profilu do aktualizacji.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = await CloudProfileManager.updateProfileVisibility(newIsPublic);
      
      if (success) {
        setIsPublic(newIsPublic);
        toast({
          title: newIsPublic ? "Profil jest teraz publiczny" : "Profil jest teraz prywatny",
          description: newIsPublic 
            ? "Inne osoby mogą teraz przeglądać Twój profil" 
            : "Tylko Ty masz dostęp do swojego profilu",
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować ustawień prywatności.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas aktualizacji ustawień.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPublicProfileUrl = () => {
    if (!currentProfile?.id) return '';
    return `${window.location.origin}/profile/${currentProfile.id}`;
  };

  const copyPublicLink = async () => {
    const url = getPublicProfileUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link skopiowany!",
        description: "Link do publicznego profilu został skopiowany do schowka.",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się skopiować linku.",
        variant: "destructive",
      });
    }
  };

  const getViewsToday = () => {
    if (!analytics?.recentViews) return 0;
    const today = new Date().toDateString();
    return analytics.recentViews.filter(view => 
      new Date(view.viewed_at).toDateString() === today
    ).length;
  };

  const getTopReferrer = () => {
    if (!analytics?.recentViews) return 'Brak danych';
    
    const referrers = analytics.recentViews
      .filter(view => view.referrer_source)
      .reduce((acc, view) => {
        const source = view.referrer_source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topReferrer = Object.entries(referrers)
      .sort(([,a], [,b]) => b - a)[0];

    return topReferrer ? topReferrer[0] : 'direct';
  };

  return (
    <Card className="cosmic-card bg-gradient-aurora border-cosmic-purple/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cosmic-gold">
          {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          Ustawienia Prywatności
        </CardTitle>
        <CardDescription className="text-cosmic-starlight">
          Kontroluj, kto może przeglądać Twój kosmiczny profil
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-cosmic-dark/30 rounded-lg border border-cosmic-purple/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-cosmic-gold">Profil publiczny</h3>
              <Badge 
                variant={isPublic ? "default" : "secondary"}
                className={isPublic 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {isPublic ? "Publiczny" : "Prywatny"}
              </Badge>
            </div>
            <p className="text-sm text-cosmic-starlight">
              {isPublic 
                ? "Inne osoby mogą przeglądać Twój profil przez link lub QR kod"
                : "Tylko Ty masz dostęp do swojego profilu"
              }
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={handleVisibilityChange}
            disabled={loading}
            className="data-[state=checked]:bg-cosmic-purple"
          />
        </div>

        {/* Public Profile Info */}
        {isPublic && currentProfile && (
          <div className="space-y-4">
            <Separator className="bg-cosmic-purple/30" />
            
            <div className="space-y-3">
              <h4 className="font-medium text-cosmic-gold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Link do publicznego profilu
              </h4>
              
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-cosmic-dark/50 rounded border border-cosmic-purple/20 text-sm text-cosmic-light font-mono">
                  {getPublicProfileUrl()}
                </div>
                <Button 
                  onClick={copyPublicLink}
                  variant="outline"
                  size="sm"
                  className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/20"
                >
                  Kopiuj
                </Button>
              </div>
            </div>

            {/* Analytics */}
            {analytics && (
              <div className="space-y-3">
                <h4 className="font-medium text-cosmic-gold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Statystyki profilu
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded text-center">
                    <div className="text-2xl font-bold text-cosmic-blue">{analytics.viewCount}</div>
                    <div className="text-xs text-cosmic-starlight">Łączne wyświetlenia</div>
                  </div>
                  
                  <div className="p-3 bg-cosmic-teal/10 border border-cosmic-teal/30 rounded text-center">
                    <div className="text-2xl font-bold text-cosmic-teal">{getViewsToday()}</div>
                    <div className="text-xs text-cosmic-starlight">Dzisiaj</div>
                  </div>
                  
                  <div className="p-3 bg-cosmic-pink/10 border border-cosmic-pink/30 rounded text-center">
                    <div className="text-sm font-bold text-cosmic-pink capitalize">{getTopReferrer()}</div>
                    <div className="text-xs text-cosmic-starlight">Top źródło</div>
                  </div>
                </div>

                {/* Recent Views */}
                {analytics.recentViews.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-cosmic-gold">Ostatnie wyświetlenia</h5>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {analytics.recentViews.slice(0, 5).map((view, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-2 bg-cosmic-dark/20 rounded text-xs"
                        >
                          <span className="text-cosmic-starlight">
                            {new Date(view.viewed_at).toLocaleString('pl-PL')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple"
                          >
                            {view.referrer_source || 'direct'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Privacy Info */}
        <Alert className="border-cosmic-blue/30 bg-cosmic-blue/10">
          <Info className="h-4 w-4 text-cosmic-blue" />
          <AlertDescription className="text-cosmic-starlight">
            {isPublic ? (
              <>
                Twój publiczny profil zawiera podstawowe informacje astrologiczne, numerologiczne i inne analizy. 
                Dane osobowe jak PIN nie są nigdy udostępniane.
              </>
            ) : (
              <>
                Gdy profil jest prywatny, tylko Ty masz do niego dostęp. 
                Możesz w każdej chwili zmienić to ustawienie.
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* What's Shared Info */}
        <div className="space-y-3">
          <h4 className="font-medium text-cosmic-gold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Co jest udostępniane publicznie
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="text-cosmic-gold font-medium">✅ Udostępniane:</div>
              <ul className="text-cosmic-starlight space-y-1">
                <li>• Imię</li>
                <li>• Data urodzenia</li>
                <li>• Miejsce urodzenia</li>
                <li>• Godzina urodzenia</li>
                <li>• Analizy astrologiczne</li>
                <li>• Numerologia</li>
                <li>• Human Design</li>
                <li>• Zodiak chiński</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="text-red-400 font-medium">❌ Nie udostępniane:</div>
              <ul className="text-cosmic-starlight space-y-1">
                <li>• PIN dostępu</li>
                <li>• Adres email</li>
                <li>• Dane logowania</li>
                <li>• Historia edycji</li>
                <li>• Prywatne notatki</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
