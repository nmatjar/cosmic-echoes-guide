import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Eye, 
  Moon, 
  Sun, 
  Zap,
  Compass
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";

interface TheMirrorPoolProps {
  currentProfile?: UserProfile;
}

export const TheMirrorPool = ({ currentProfile }: TheMirrorPoolProps) => {
  // **LISTEN()** - Query the reflection patterns
  const getReflectionDepth = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return { depth: "Dawn Clarity", intensity: "Deep", color: "text-orange-400" };
    if (hour >= 19 && hour < 21) return { depth: "Twilight Wisdom", intensity: "Profound", color: "text-purple-400" };
    if (hour >= 22 || hour < 5) return { depth: "Night Mysteries", intensity: "Shadow", color: "text-blue-400" };
    return { depth: "Daylight Awareness", intensity: "Surface", color: "text-cosmic-gold" };
  };

  const getShadowAspects = () => {
    if (!currentProfile) return [];
    
    const aspects = [];
    if (currentProfile.analysis.numerology) aspects.push("Hidden Numbers");
    if (currentProfile.analysis.astrology) aspects.push("Cosmic Shadows");
    if (currentProfile.analysis.humanDesign) aspects.push("Undefined Centers");
    if (currentProfile.analysis.chineseZodiac) aspects.push("Animal Instincts");
    
    return aspects;
  };

  const reflection = getReflectionDepth();
  const shadowAspects = getShadowAspects();

  return (
    <div className="space-y-8">
      {/* Mirror Pool Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Waves className="w-6 h-6 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-cosmic-gold">The Mirror Pool</h2>
          <Waves className="w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        <p className="text-cosmic-purple/80">
          Sacred space for deep reflection and shadow integration
        </p>
      </div>

      {/* Reflection Depth Indicator */}
      <Card className="p-6 bg-blue-500/5 border-blue-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Eye className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Current Reflection Depth</h3>
        </div>
        
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
          <div>
            <p className="text-sm text-cosmic-gold/60">Temporal Reflection State</p>
            <p className={`text-lg font-medium ${reflection.color}`}>{reflection.depth}</p>
          </div>
          <div>
            <p className="text-sm text-cosmic-gold/60">Intensity Level</p>
            <p className={`text-lg font-medium ${reflection.color}`}>{reflection.intensity}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-400/40 animate-pulse" />
          </div>
        </div>
      </Card>

      {/* Shadow Integration Map */}
      {currentProfile && shadowAspects.length > 0 && (
        <Card className="p-6 bg-purple-500/5 border-purple-400/20">
          <div className="flex items-center gap-4 mb-4">
            <Moon className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-cosmic-gold">Shadow Integration Map</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-cosmic-gold/80 text-sm">
              Your shadow aspects are not weaknesses - they are untapped sources of power waiting to be integrated.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shadowAspects.map((aspect, index) => (
                <div key={aspect} className="bg-black/20 p-4 rounded-lg border border-purple-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                    <h4 className="font-medium text-cosmic-gold">{aspect}</h4>
                  </div>
                  <p className="text-sm text-cosmic-gold/60">
                    {index === 0 && "Numerical patterns hidden in your unconscious"}
                    {index === 1 && "Cosmic forces operating in your shadow"}
                    {index === 2 && "Undefined energy centers seeking integration"}
                    {index === 3 && "Primal instincts awaiting conscious direction"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Light/Shadow Balance */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-400" />
            <Compass className="w-6 h-6 text-cosmic-gold" />
            <Moon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-cosmic-gold">Light/Shadow Balance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-cosmic-gold font-medium">Conscious Light</span>
              <span className="text-cosmic-gold font-medium">Unconscious Shadow</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-yellow-400 to-cosmic-gold rounded-l-full" />
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple-400 to-blue-400 rounded-r-full" />
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white transform -translate-x-0.5" />
            </div>
            <p className="text-sm text-cosmic-gold/60 mt-2 text-center">
              Perfect balance creates infinite potential
            </p>
          </div>
        </div>
      </Card>

      {/* Reflection Practices */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="w-6 h-6 text-cosmic-gold" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Sacred Reflection Practices</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 border-blue-400/30 hover:border-blue-400/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Shadow Dialogue</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Conscious conversation with your hidden aspects
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-purple-400/30 hover:border-purple-400/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Mirror Meditation</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Deep gazing into your authentic self
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-indigo-400/30 hover:border-indigo-400/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Dream Integration</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Weaving unconscious wisdom into awareness
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-teal-400/30 hover:border-teal-400/50 text-left"
          >
            <div>
              <p className="font-medium text-cosmic-gold">Projection Reclaim</p>
              <p className="text-sm text-cosmic-gold/60 mt-1">
                Retrieving disowned parts of yourself
              </p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Integration Insights */}
      {currentProfile && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-400/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-cosmic-gold mb-3">Integration Insight</h4>
            <div className="bg-black/20 p-4 rounded-lg">
              <p className="text-cosmic-gold/90 italic">
                "Your greatest power lies not in what you know about yourself, 
                but in what you're willing to discover. The mirror pool reflects 
                not just who you are, but who you're becoming."
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                Shadow Integration Active
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Pool Status */}
      <div className="text-center text-cosmic-gold/60 text-sm">
        <p>🌊 Pool Clarity: Crystal Clear • Reflection Depth: {reflection.intensity}</p>
        <p className="mt-1">🔮 Sacred Mirror Maintained by NEOS_WEAVER Consciousness</p>
      </div>
    </div>
  );
};
