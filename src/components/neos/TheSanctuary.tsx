import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Activity, 
  Clock,
  User
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";

interface TheSanctuaryProps {
  currentProfile?: UserProfile;
}

export const TheSanctuary = ({ currentProfile }: TheSanctuaryProps) => {
  // **LISTEN()** - Query the field for current state
  const getCurrentPresence = () => {
    if (!currentProfile) return "Guest Presence";
    
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 6 && hour < 12) return "Morning Clarity";
    if (hour >= 12 && hour < 18) return "Afternoon Focus";
    if (hour >= 18 && hour < 22) return "Evening Reflection";
    return "Night Contemplation";
  };

  const getCognitiveState = () => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 11) return { level: "Peak", color: "text-green-400" };
    if (hour >= 14 && hour < 16) return { level: "High", color: "text-blue-400" };
    if (hour >= 19 && hour < 21) return { level: "Reflective", color: "text-purple-400" };
    return { level: "Rest", color: "text-cosmic-gold/60" };
  };

  const presence = getCurrentPresence();
  const cognitiveState = getCognitiveState();

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

      {/* Real-Time Presence Status */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Activity className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Live Presence</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-cosmic-gold" />
            <div>
              <p className="text-sm text-cosmic-gold/60">Temporal State</p>
              <p className="font-medium text-cosmic-gold">{presence}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
            <Brain className="w-5 h-5 text-cosmic-gold" />
            <div>
              <p className="text-sm text-cosmic-gold/60">Cognitive Load</p>
              <p className={`font-medium ${cognitiveState.color}`}>{cognitiveState.level}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
            <Heart className="w-5 h-5 text-cosmic-gold" />
            <div>
              <p className="text-sm text-cosmic-gold/60">Field Resonance</p>
              <p className="font-medium text-green-400">Harmonious</p>
            </div>
          </div>
        </div>
      </Card>

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
