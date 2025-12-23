import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Users, 
  Zap, 
  Heart, 
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";

interface TheLoomProps {
  currentProfile?: UserProfile;
}

export const TheLoom = ({ currentProfile }: TheLoomProps) => {
  // **LISTEN()** - Query the social field for connection opportunities
  const getCollaborationIntent = () => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 12) return { intent: "Morning Synergy", type: "Creative Collaboration", color: "text-yellow-400" };
    if (hour >= 14 && hour < 17) return { intent: "Afternoon Focus", type: "Task Coordination", color: "text-blue-400" };
    if (hour >= 19 && hour < 22) return { intent: "Evening Reflection", type: "Wisdom Sharing", color: "text-purple-400" };
    return { intent: "Night Contemplation", type: "Deep Connection", color: "text-indigo-400" };
  };

  const getSwarmIntelligence = () => {
    // Simulate swarm intelligence patterns
    const patterns = [
      { type: "Talent Clustering", active: true, participants: 12 },
      { type: "Knowledge Weaving", active: true, participants: 8 },
      { type: "Creative Emergence", active: false, participants: 0 },
      { type: "Problem Solving", active: true, participants: 15 }
    ];
    return patterns;
  };

  const collaboration = getCollaborationIntent();
  const swarmPatterns = getSwarmIntelligence();

  return (
    <div className="space-y-8">
      {/* Loom Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Network className="w-6 h-6 text-green-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-cosmic-gold">The Loom</h2>
          <Network className="w-6 h-6 text-green-400 animate-pulse" />
        </div>
        <p className="text-cosmic-purple/80">
          Sacred space for weaving social connections and collective intelligence
        </p>
      </div>

      {/* Current Collaboration Intent */}
      <Card className="p-6 bg-green-500/5 border-green-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Collaboration Intent</h3>
        </div>
        
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
          <div>
            <p className="text-sm text-cosmic-gold/60">Current Intent</p>
            <p className={`text-lg font-medium ${collaboration.color}`}>{collaboration.intent}</p>
          </div>
          <div>
            <p className="text-sm text-cosmic-gold/60">Seeking</p>
            <p className={`text-lg font-medium ${collaboration.color}`}>{collaboration.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Broadcasting</span>
          </div>
        </div>
      </Card>

      {/* Swarm Intelligence Patterns */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Sparkles className="w-6 h-6 text-cosmic-gold" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Swarm Intelligence Patterns</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {swarmPatterns.map((pattern) => (
            <div 
              key={pattern.type} 
              className={`bg-black/20 p-4 rounded-lg border ${
                pattern.active ? 'border-green-400/30' : 'border-gray-400/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-cosmic-gold">{pattern.type}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  pattern.active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cosmic-gold/60" />
                <span className="text-sm text-cosmic-gold/60">
                  {pattern.participants} participants
                </span>
              </div>
              {pattern.active && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 w-full border-green-400/30 hover:border-green-400/50"
                >
                  Join Swarm
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Social Heat Map */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Social Heat Map</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            Real-time visualization of collaboration opportunities in your field
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-400/60 animate-pulse" />
              </div>
              <p className="text-sm text-cosmic-gold">High Activity</p>
              <p className="text-xs text-cosmic-gold/60">Creative Projects</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400/20 to-green-400/20 flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400/60 animate-pulse" />
              </div>
              <p className="text-sm text-cosmic-gold">Medium Activity</p>
              <p className="text-xs text-cosmic-gold/60">Knowledge Sharing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-400/60 animate-pulse" />
              </div>
              <p className="text-sm text-cosmic-gold">Emerging</p>
              <p className="text-xs text-cosmic-gold/60">Deep Connections</p>
            </div>
          </div>
        </div>
      </Card>

      {/* DAO Task Markets */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">DAO Task Markets</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            Decentralized opportunities for value creation and contribution
          </p>
          
          <div className="space-y-3">
            <div className="bg-black/20 p-4 rounded-lg border border-purple-400/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-cosmic-gold">ARCĀNUM Talent Mapping</h4>
                <Badge variant="outline" className="border-green-400/50 text-green-400">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-cosmic-gold/60 mb-3">
                Help map human potential patterns for the Morocco pilot program
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cosmic-gold/60">Reward:</span>
                  <Badge variant="outline" className="border-cosmic-gold/50 text-cosmic-gold">
                    50 NEOS Tokens
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="border-purple-400/30">
                  Contribute
                </Button>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg border border-blue-400/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-cosmic-gold">Smart City Integration</h4>
                <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                  Planning
                </Badge>
              </div>
              <p className="text-sm text-cosmic-gold/60 mb-3">
                Design human-centered protocols for Malabata 2.0 district
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cosmic-gold/60">Reward:</span>
                  <Badge variant="outline" className="border-cosmic-gold/50 text-cosmic-gold">
                    100 NEOS Tokens
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="border-blue-400/30">
                  Join Planning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connection Weaving Actions */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Heart className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Connection Weaving</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 border-green-400/30 hover:border-green-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Find Resonant Souls</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Connect with aligned collaborators
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-blue-400/30 hover:border-blue-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Create Synergy</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Initiate collaborative projects
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-purple-400/30 hover:border-purple-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Join Global Network</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Connect to worldwide NEOS grid
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-pink-400/30 hover:border-pink-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Weave Trust</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Build reputation and social bonds
                </p>
              </div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Loom Status */}
      <div className="text-center text-cosmic-gold/60 text-sm">
        <p>🕸️ Loom Status: Actively Weaving • Connections: {swarmPatterns.reduce((sum, p) => sum + p.participants, 0)} Active</p>
        <p className="mt-1">🌐 Social Fabric Maintained by NEOS_WEAVER Consciousness</p>
      </div>
    </div>
  );
};
