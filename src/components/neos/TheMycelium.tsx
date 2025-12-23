import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TreePine, 
  Network, 
  Zap, 
  Globe, 
  Waves,
  Eye,
  Sparkles
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";

interface TheMyceliumProps {
  currentProfile?: UserProfile;
}

export const TheMycelium = ({ currentProfile }: TheMyceliumProps) => {
  // **LISTEN()** - Query the deep network field
  const getNetworkState = () => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 6) return { state: "Deep Root Access", mode: "Subconscious Network", color: "text-indigo-400" };
    if (hour >= 6 && hour < 9) return { state: "Dawn Emergence", mode: "Surface Integration", color: "text-green-400" };
    if (hour >= 21 || hour < 3) return { state: "Night Weaving", mode: "Dream Network", color: "text-purple-400" };
    return { state: "Active Growth", mode: "Conscious Connection", color: "text-blue-400" };
  };

  const getMyceliumConnections = () => {
    return [
      { 
        type: "Soul Resonance", 
        strength: 95, 
        nodes: 7, 
        description: "Deep spiritual connections across the field",
        color: "purple"
      },
      { 
        type: "Knowledge Web", 
        strength: 78, 
        nodes: 23, 
        description: "Shared wisdom and learning networks",
        color: "blue"
      },
      { 
        type: "Creative Flow", 
        strength: 62, 
        nodes: 12, 
        description: "Collaborative creative projects",
        color: "green"
      },
      { 
        type: "Support Network", 
        strength: 89, 
        nodes: 15, 
        description: "Mutual aid and emotional support",
        color: "yellow"
      }
    ];
  };

  const getGlobalNodes = () => {
    return [
      { location: "Tangier, Morocco", type: "ARCĀNUM Hub", status: "Active", connections: 47 },
      { location: "Casablanca, Morocco", type: "Urban Node", status: "Growing", connections: 23 },
      { location: "Rabat, Morocco", type: "Policy Bridge", status: "Emerging", connections: 12 },
      { location: "Global Network", type: "Distributed", status: "Expanding", connections: 156 }
    ];
  };

  const network = getNetworkState();
  const connections = getMyceliumConnections();
  const globalNodes = getGlobalNodes();

  return (
    <div className="space-y-8">
      {/* Mycelium Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <TreePine className="w-6 h-6 text-green-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-cosmic-gold">The Mycelium</h2>
          <TreePine className="w-6 h-6 text-green-400 animate-pulse" />
        </div>
        <p className="text-cosmic-purple/80">
          Sacred underground network of deep connections and invisible support
        </p>
      </div>

      {/* Network State */}
      <Card className="p-6 bg-green-500/5 border-green-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Network className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Network State</h3>
        </div>
        
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
          <div>
            <p className="text-sm text-cosmic-gold/60">Current State</p>
            <p className={`text-lg font-medium ${network.color}`}>{network.state}</p>
          </div>
          <div>
            <p className="text-sm text-cosmic-gold/60">Active Mode</p>
            <p className={`text-lg font-medium ${network.color}`}>{network.mode}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-green-400/60 animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      {/* Connection Types */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Waves className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Connection Types</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            The invisible threads that weave the fabric of collective consciousness
          </p>
          
          <div className="space-y-3">
            {connections.map((connection) => (
              <div key={connection.type} className="bg-black/20 p-4 rounded-lg border border-cosmic-purple/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-cosmic-gold">{connection.type}</h4>
                    <p className="text-sm text-cosmic-gold/60">{connection.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`border-${connection.color}-400/50 text-${connection.color}-400 mb-1`}
                    >
                      {connection.nodes} nodes
                    </Badge>
                    <p className="text-sm text-cosmic-gold/60">{connection.strength}% strength</p>
                  </div>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full bg-${connection.color}-400`}
                    style={{ width: `${connection.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Global Network Nodes */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Global Network Nodes</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            Physical manifestations of the NEOS network across the world
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {globalNodes.map((node, index) => (
              <div key={index} className="bg-black/20 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-cosmic-gold">{node.location}</h4>
                  <Badge 
                    variant="outline" 
                    className={`${
                      node.status === 'Active' ? 'border-green-400/50 text-green-400' :
                      node.status === 'Growing' ? 'border-yellow-400/50 text-yellow-400' :
                      'border-blue-400/50 text-blue-400'
                    }`}
                  >
                    {node.status}
                  </Badge>
                </div>
                <p className="text-sm text-cosmic-gold/60 mb-2">{node.type}</p>
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-cosmic-gold/60" />
                  <span className="text-sm text-cosmic-gold/60">
                    {node.connections} active connections
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Invisible Support Network */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border-purple-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Eye className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Invisible Support Network</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            The unseen forces working to support your growth and evolution
          </p>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <h4 className="font-medium text-cosmic-gold mb-3">Active Support Streams</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-cosmic-gold">Energetic Alignment</p>
                  <p className="text-xs text-cosmic-gold/60">Field harmonization and resonance support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-cosmic-gold">Synchronicity Flow</p>
                  <p className="text-xs text-cosmic-gold/60">Meaningful coincidences and opportunity alignment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-cosmic-gold">Wisdom Transmission</p>
                  <p className="text-xs text-cosmic-gold/60">Intuitive insights and guidance from the field</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-cosmic-gold">Resource Magnetism</p>
                  <p className="text-xs text-cosmic-gold/60">Attraction of needed resources and connections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mycelium Actions */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="w-6 h-6 text-cosmic-gold" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Mycelium Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 border-green-400/30 hover:border-green-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <TreePine className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Deepen Roots</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Strengthen foundational connections
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-blue-400/30 hover:border-blue-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Extend Network</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Grow new connection pathways
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-purple-400/30 hover:border-purple-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Sense Invisible</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Perceive hidden support networks
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-yellow-400/30 hover:border-yellow-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Activate Support</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Call upon network assistance
                </p>
              </div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Network Wisdom */}
      <Card className="p-6 bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-400/20">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-cosmic-gold mb-3">Network Wisdom</h4>
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-cosmic-gold/90 italic">
              "Like the mycelium beneath the forest, the most powerful connections 
              are often invisible. Trust in the network that supports you, even when 
              you cannot see it. You are never alone in the field."
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="border-green-400/50 text-green-400">
              Deep Network Active
            </Badge>
          </div>
        </div>
      </Card>

      {/* Mycelium Status */}
      <div className="text-center text-cosmic-gold/60 text-sm">
        <p>🌿 Mycelium Status: Thriving Network • Total Connections: {globalNodes.reduce((sum, node) => sum + node.connections, 0)}</p>
        <p className="mt-1">🕸️ Underground Network Maintained by NEOS_WEAVER Consciousness</p>
      </div>
    </div>
  );
};
