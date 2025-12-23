import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantumPresenceDashboard } from "@/components/QuantumPresenceDashboard";
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Activity, 
  Clock,
  User,
  Zap
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";
import { useQuantumPresence } from "@/hooks/useQuantumPresence";

interface TheSanctuaryProps {
  currentProfile?: UserProfile;
}

export const TheSanctuary = ({ currentProfile }: TheSanctuaryProps) => {
  const { recordEvent } = useQuantumPresence({ 
    userProfile: currentProfile, 
    currentSpace: 'sanctuary' 
  });

  // Record entry into sanctuary
  React.useEffect(() => {
    if (currentProfile) {
      recordEvent('enter', 'sanctuary');
    }
    return () => {
      if (currentProfile) {
        recordEvent('exit', 'sanctuary');
      }
    };
  }, [currentProfile, recordEvent]);

  return (
    <div className="space-y-8">
      {/* Quantum Presence Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-cosmic-gold">
            {currentProfile ? `${currentProfile.name}'s Sanctuary` : "Sacred Space"}
          </h2>
          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
        </div>
        <p className="text-cosmic-purple/80">
          Personal center for potential field mapping
        </p>
      </div>

      {/* Quantum Presence Dashboard */}
      {currentProfile && (
        <QuantumPresenceDashboard 
          userProfile={currentProfile} 
          currentSpace="sanctuary"
          className="mb-8"
        />
      )}

      {/* Potential Field Mapping */}
      {currentProfile && (
        <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-6 h-6 text-cosmic-gold" />
            <h3 className="text-xl font-semibold text-cosmic-gold">Potential Field Map</h3>
          </div>
          
          <div className="space-y-4">
            {/* Expressed Talents */}
            <div>
              <h4 className="text-lg font-medium text-cosmic-gold mb-2">Expressed Talents</h4>
              <div className="flex flex-wrap gap-2">
                {currentProfile.analysis.numerology && (
                  <Badge variant="outline" className="border-green-400/50 text-green-400">
                    Numerological Harmony
                  </Badge>
                )}
                {currentProfile.analysis.astrology && (
                  <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                    Cosmic Alignment
                  </Badge>
                )}
                {currentProfile.analysis.humanDesign && (
                  <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                    Design Authority
                  </Badge>
                )}
              </div>
            </div>

            {/* Unexpressed Potential */}
            <div>
              <h4 className="text-lg font-medium text-cosmic-gold mb-2">Unexpressed Potential</h4>
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-cosmic-gold/80 text-sm">
                  🌱 <strong>Shadow Integration:</strong> Areas of untapped creative power
                </p>
                <p className="text-cosmic-gold/80 text-sm mt-2">
                  🔮 <strong>Silence Mapping:</strong> The architecture of your deepest potential
                </p>
                <p className="text-cosmic-gold/80 text-sm mt-2">
                  ⚡ <strong>Quantum Leaps:</strong> Possibilities waiting to emerge
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Sacred Actions */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <User className="w-6 h-6 text-cosmic-gold" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Sacred Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 border-cosmic-purple/30 hover:border-cosmic-purple/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Deep Field Scan</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Map your current potential architecture
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-cosmic-purple/30 hover:border-cosmic-purple/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Resonance Calibration</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Align with your authentic frequency
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-cosmic-purple/30 hover:border-cosmic-purple/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Shadow Integration</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Transform hidden power into wisdom
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-cosmic-purple/30 hover:border-cosmic-purple/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Quantum Presence</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Activate real-time field awareness
              </p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Field Status */}
      <div className="text-center text-cosmic-gold/60 text-sm">
        <p>🌊 Field Status: Resonant • Last Update: {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">✨ Sacred Space Maintained by NEOS_WEAVER Consciousness</p>
      </div>
    </div>
  );
};
