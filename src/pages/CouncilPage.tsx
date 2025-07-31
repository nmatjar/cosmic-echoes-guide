import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CouncilChat } from '../components/CouncilChat';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Sparkles, Users, MessageCircle, Brain, Heart, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../engine/userProfile';
import { getProfiles } from '../services/profileManager';

export const CouncilPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profiles = getProfiles();
      // Dla uproszczenia, bierzemy pierwszy profil
      // W przyszłości można dodać logikę wyboru profilu dla użytkownika
      const userProfile = profiles.length > 0 ? profiles[0] : null;
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Rada Kosmiczna</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Aby korzystać z Rady Kosmicznej, musisz być zalogowany i mieć utworzony profil kosmiczny.
            </p>
            <div className="space-y-2">
              <Link to="/auth">
                <Button className="w-full">
                  Zaloguj się
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Utwórz profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Rada Kosmiczna
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Połącz się z mądrością wszechświata poprzez zespół sześciu unikalnych przewodników duchowych, 
              każdy z własną perspektywą i specjalizacją.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Sześciu Przewodników</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Każdy agent ma unikalną perspektywę: od wizjonerskiej Wyroczni po praktycznego Pioniera.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Sztuczna Inteligencja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Zaawansowane modele AI analizują Twój profil kosmiczny i dostarczają spersonalizowane wskazówki.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Interaktywne Sesje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Prowadź głębokie rozmowy, zapisuj sesje i śledź swoją duchową podróż w czasie.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <CouncilChat userProfile={profile} userId={user.id} />

        {/* How it Works */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Compass className="h-6 w-6" />
                Jak działa Rada Kosmiczna?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Ustaw Intencję</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rozpocznij sesję określając cel lub temat, nad którym chcesz pracować.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Zadaj Pytanie</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rada automatycznie wybierze najlepszego agenta lub możesz wybrać konkretnego przewodnika.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Otrzymaj Wskazówki</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Agent analizuje Twój profil kosmiczny i dostarcza spersonalizowane porady.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 dark:text-green-400 font-bold">4</span>
                  </div>
                  <h3 className="font-semibold">Kontynuuj Dialog</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prowadź głęboką rozmowę i zapisz sesję dla przyszłych refleksji.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Heart className="h-6 w-6" />
                Korzyści z Rady Kosmicznej
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dla Rozwoju Osobistego</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Głębsze zrozumienie swojej natury i potencjału</li>
                    <li>• Wskazówki w podejmowaniu ważnych decyzji życiowych</li>
                    <li>• Odkrywanie ukrytych talentów i możliwości</li>
                    <li>• Praca z wyzwaniami i przeszkodami</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dla Duchowego Wzrostu</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Połączenie z wyższą mądrością i intuicją</li>
                    <li>• Zrozumienie swojej misji życiowej</li>
                    <li>• Harmonizacja energii i równowagi wewnętrznej</li>
                    <li>• Wsparcie w praktykach duchowych</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
