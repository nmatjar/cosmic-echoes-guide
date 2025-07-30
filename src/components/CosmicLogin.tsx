import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, User, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { UserProfile } from "@/engine/userProfile";

interface CosmicLoginProps {
  profiles: UserProfile[];
  onProfileSelected: (profile: UserProfile) => void;
  onCreateNew: () => void;
  onDeleteProfile: (profileId: string) => void;
}

export function CosmicLogin({ profiles, onProfileSelected, onCreateNew, onDeleteProfile }: CosmicLoginProps) {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedProfile) return;

    if (pin !== selectedProfile.pin) {
      toast.error("Nieprawidłowy PIN", {
        description: "Spróbuj ponownie",
        duration: 3000
      });
      setPin('');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`🌟 Witaj ponownie, ${selectedProfile.name}!`, {
      description: "Twój Kosmiczny Portret został załadowany",
      duration: 3000
    });
    
    onProfileSelected(selectedProfile);
    setIsLoading(false);
  };

  const handleDeleteProfile = (profileId: string, profileName: string) => {
    if (confirm(`Czy na pewno chcesz usunąć profil "${profileName}"? Ta akcja jest nieodwracalna.`)) {
      onDeleteProfile(profileId);
      toast.success("Profil został usunięty", {
        description: "Dane zostały trwale usunięte z przeglądarki",
        duration: 3000
      });
      setSelectedProfile(null);
      setPin('');
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
        <Card className="w-full max-w-md cosmic-card bg-gradient-mystical border-cosmic-purple/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-cosmic-gold">
              🌟 Brak Profili
            </CardTitle>
            <CardDescription className="text-cosmic-starlight">
              Nie znaleziono żadnych zapisanych profili kosmicznych
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Button 
              onClick={onCreateNew}
              className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300"
            >
              ✨ Stwórz Pierwszy Profil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
      <Card className="w-full max-w-md cosmic-card bg-gradient-mystical border-cosmic-purple/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cosmic-teal to-cosmic-blue rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl text-cosmic-gold">
            🔐 Wybierz Profil
          </CardTitle>
          <CardDescription className="text-cosmic-starlight">
            Zaloguj się do swojego Kosmicznego Portretu
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Profile Selection */}
          <div className="space-y-2">
            <Label className="text-cosmic-gold">Dostępne profile:</Label>
            <div className="space-y-2">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedProfile?.id === profile.id
                      ? 'border-cosmic-purple bg-cosmic-purple/20'
                      : 'border-cosmic-purple/30 bg-cosmic-purple/10 hover:bg-cosmic-purple/15'
                  }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="text-lg">⭐</span>
                        <span className="text-lg">🐉</span>
                      </div>
                      <div>
                        <p className="font-medium text-cosmic-gold">{profile.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple text-xs">
                            Profil
                          </Badge>
                          <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold text-xs">
                            {new Date(profile.createdAt).toLocaleDateString('pl-PL')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profile.id, profile.name);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Input */}
          {selectedProfile && (
            <div className="space-y-2">
              <Label htmlFor="login-pin" className="text-cosmic-gold">
                PIN dla {selectedProfile.name}
              </Label>
              <div className="relative">
                <Input
                  id="login-pin"
                  type={showPin ? "text" : "password"}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="border-cosmic-purple/30 bg-cosmic-purple/10 text-center text-lg tracking-widest pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4 text-cosmic-starlight" />
                  ) : (
                    <Eye className="h-4 w-4 text-cosmic-starlight" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {selectedProfile && (
              <Button 
                onClick={handleLogin}
                disabled={isLoading || pin.length < 4}
                className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:from-cosmic-pink hover:to-cosmic-purple transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logowanie...
                  </>
                ) : (
                  '🚀 Wejdź do Kosmosu'
                )}
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={onCreateNew}
              className="w-full border-cosmic-gold/30 text-cosmic-gold hover:bg-cosmic-gold/10"
            >
              ✨ Stwórz Nowy Profil
            </Button>
          </div>

          {/* Info */}
          <div className="bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg p-3">
            <p className="text-xs text-cosmic-starlight">
              💡 Profile są przechowywane lokalnie w Twojej przeglądarce. 
              Pamiętaj o regularnym tworzeniu kopii zapasowych.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
