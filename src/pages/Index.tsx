import { AstrologicalSection } from "@/components/AstrologicalSection";
import { NumerologySection } from "@/components/NumerologySection";
import { ChineseZodiacSection } from "@/components/ChineseZodiacSection";
import { HumanDesignSection } from "@/components/HumanDesignSection";
import { MayanSection } from "@/components/MayanSection";
import { BioRhythmSection } from "@/components/BioRhythmSection";
import { ElementalBalanceSection } from "@/components/ElementalBalanceSection";
import { DailyInsightsSection } from "@/components/DailyInsightsSection";
import { GuidePersonas } from "@/components/GuidePersonas";
import { SmartPromptGenerator } from "@/components/SmartPromptGenerator";
import { SmartNavigation } from "@/components/SmartNavigation";
import { ExportHub } from "@/components/ExportHub";
import { ProfilePrivacySettings } from "@/components/ProfilePrivacySettings";
import { CosmicCard } from "@/components/ui/cosmic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

import { UserProfile } from "@/engine/userProfile";

interface IndexProps {
  currentProfile: UserProfile | null;
  onLogout: () => void;
}

const Index = ({ currentProfile, onLogout }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SmartNavigation />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cosmic opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              ✨ Kosmiczny Portret Duszy ✨
            </h1>
            <p className="text-xl text-cosmic-starlight max-w-3xl mx-auto leading-relaxed">
              Kompleksowa analiza Twojej duchowej esencji przez pryzmat starożytnych systemów mądrości
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple px-4 py-2">
                {currentProfile?.analysis.astrology?.sunSign?.icon || '❔'} {currentProfile?.analysis.astrology?.sunSign?.name || 'Astrologia'}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold px-4 py-2">
                🔢 {currentProfile?.analysis.numerology?.lifePathNumber || '?'}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-pink/20 border-cosmic-pink/30 text-cosmic-pink px-4 py-2">
                {currentProfile?.analysis.chineseZodiac?.icon || '❔'} {currentProfile?.analysis.chineseZodiac?.animal || 'Zodiak Chiński'}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-teal/20 border-cosmic-teal/30 text-cosmic-teal px-4 py-2">
                ⚡ {currentProfile?.analysis.humanDesign?.type || 'Human Design'}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-blue/20 border-cosmic-blue/30 text-cosmic-blue px-4 py-2">
                🏛️ {currentProfile?.analysis.mayan?.sign || 'Majowie'}
              </Badge>
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple px-4 py-2">
                🧬⏰ Bio-Rytmy
              </Badge>
              <Badge variant="outline" className="bg-cosmic-gold/20 border-cosmic-gold/30 text-cosmic-gold px-4 py-2">
                ☯️🌳 Żywioły
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        {currentProfile && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-cosmic-gold" />
              <h2 className="text-2xl font-bold text-cosmic-gold">
                {currentProfile.name}
              </h2>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyInsightsSection profile={currentProfile} />
          <NumerologySection profile={currentProfile} />
          <AstrologicalSection profile={currentProfile} />
          <ChineseZodiacSection profile={currentProfile} />
          <HumanDesignSection profile={currentProfile} />
          <MayanSection profile={currentProfile} />
          <BioRhythmSection profile={currentProfile} />
          <ElementalBalanceSection profile={currentProfile} />
        </div>
        
        {/* Cosmic Council Gateway */}
        <div className="mb-8">
          <CosmicCard className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 border-purple-500/30 relative overflow-hidden">
            {/* Mystical background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-4 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-8 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🌟</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  🔮 Rada Kosmiczna Czeka 🔮
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Twój kosmiczny portret jest gotowy. Czas spotkać się z sześcioma mądrymi przewodnikami duchowymi, 
                  którzy pomogą Ci zrozumieć głębsze znaczenie Twojej duchowej podróży.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => window.location.href = '/council'}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
                >
                  ✨ Wejdź do Świątyni Mądrości ✨
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm">
                <div className="text-center space-y-1">
                  <div className="text-2xl">🔮</div>
                  <p className="text-purple-300 font-medium">Wyrocznia</p>
                  <p className="text-gray-400 text-xs">Wizje przyszłości</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">📚</div>
                  <p className="text-blue-300 font-medium">Mędrzec</p>
                  <p className="text-gray-400 text-xs">Starożytna wiedza</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">💚</div>
                  <p className="text-green-300 font-medium">Uzdrowiciel</p>
                  <p className="text-gray-400 text-xs">Energia życiowa</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">🧭</div>
                  <p className="text-yellow-300 font-medium">Przewodnik</p>
                  <p className="text-gray-400 text-xs">Kierunek życia</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">🛡️</div>
                  <p className="text-red-300 font-medium">Strażnik</p>
                  <p className="text-gray-400 text-xs">Ochrona ducha</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">🚀</div>
                  <p className="text-orange-300 font-medium">Pionier</p>
                  <p className="text-gray-400 text-xs">Nowe ścieżki</p>
                </div>
              </div>
            </div>
          </CosmicCard>
        </div>

        {/* Guide Personas */}
        <div data-section="guides">
          <GuidePersonas />
        </div>
        
        {/* Enhanced Features - Full Width */}
        <div className="space-y-8">
          <SmartPromptGenerator currentProfile={currentProfile} />
          <ExportHub currentProfile={currentProfile} />
          <ProfilePrivacySettings currentProfile={currentProfile} />
        </div>
        
        {/* Footer */}
        <CosmicCard className="text-center">
          <p className="text-muted-foreground">
            🌟 Każdy system oferuje unikalną perspektywę na Twoją duchową podróż. 
            Użyj przycisku kopiowania, aby zachować najważniejsze fragmenty i kontynuować eksplorację z AI.
          </p>
        </CosmicCard>
      </div>
    </div>
  );
};

export default Index;
