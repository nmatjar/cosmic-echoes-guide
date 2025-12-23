import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  Lightbulb, 
  Search, 
  Star,
  Scroll,
  Zap,
  Target,
  Users,
  TrendingUp,
  Shield,
  Compass,
  Key,
  Crown,
  Gem
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";
import { ArcanumDashboard } from "./ArcanumDashboard";
import { ArcanumLearningHub } from "./ArcanumLearningHub";

interface TheLibraryProps {
  currentProfile?: UserProfile;
}

export const TheLibrary = ({ currentProfile }: TheLibraryProps) => {
  // **LISTEN()** - Query the knowledge field for learning opportunities
  const getKnowledgeState = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return { state: "Morning Absorption", mode: "Deep Learning", color: "text-blue-400" };
    if (hour >= 10 && hour < 14) return { state: "Peak Synthesis", mode: "Knowledge Integration", color: "text-green-400" };
    if (hour >= 14 && hour < 18) return { state: "Afternoon Application", mode: "Practical Wisdom", color: "text-yellow-400" };
    if (hour >= 18 && hour < 22) return { state: "Evening Reflection", mode: "Wisdom Distillation", color: "text-purple-400" };
    return { state: "Night Contemplation", mode: "Intuitive Knowing", color: "text-indigo-400" };
  };

  // ARCANUM Knowledge Domains
  const getArcanumDomains = () => {
    return [
      {
        name: "Psychometric Analysis",
        icon: Brain,
        level: "Advanced",
        progress: 78,
        color: "text-blue-400",
        description: "Deep psychological profiling and behavioral prediction",
        modules: ["Personality Vectors", "Leadership Assessment", "Stress Response Analysis", "Decision Making Patterns"]
      },
      {
        name: "Strategic Leadership",
        icon: Crown,
        level: "Expert", 
        progress: 85,
        color: "text-yellow-400",
        description: "Executive decision making and organizational influence",
        modules: ["Executive Presence", "Team Dynamics", "Change Management", "Cultural Intelligence"]
      },
      {
        name: "Human Potential Engineering",
        icon: Zap,
        level: "Intermediate",
        progress: 65,
        color: "text-purple-400",
        description: "Optimization of human capabilities and performance",
        modules: ["Talent Development", "Performance Optimization", "Potential Mapping", "Growth Trajectories"]
      },
      {
        name: "Business Intelligence",
        icon: TrendingUp,
        level: "Advanced",
        progress: 72,
        color: "text-green-400",
        description: "Strategic insights and market intelligence",
        modules: ["Market Analysis", "Competitive Intelligence", "Risk Assessment", "Opportunity Mapping"]
      },
      {
        name: "Cultural Dynamics",
        icon: Users,
        level: "Intermediate",
        progress: 58,
        color: "text-cyan-400",
        description: "Cross-cultural communication and adaptation",
        modules: ["Cultural Intelligence", "Global Leadership", "Communication Patterns", "Adaptation Strategies"]
      }
    ];
  };

  // ARCANUM Learning Paths
  const getArcanumLearningPaths = () => {
    return [
      {
        title: "ARCĀNUM Executive Mastery",
        type: "Leadership Development",
        difficulty: "Advanced",
        duration: "12 weeks",
        relevance: "High",
        icon: Crown,
        color: "text-yellow-400",
        description: "Complete executive leadership transformation program",
        modules: ["Strategic Thinking", "Executive Presence", "Decision Architecture", "Influence Mastery"]
      },
      {
        title: "Psychometric Intelligence",
        type: "Core Knowledge",
        difficulty: "Intermediate",
        duration: "8 weeks", 
        relevance: "High",
        icon: Brain,
        color: "text-blue-400",
        description: "Master the art of human psychological analysis",
        modules: ["Personality Profiling", "Behavioral Prediction", "Stress Analysis", "Motivation Mapping"]
      },
      {
        title: "Hidden Gems Discovery",
        type: "Advanced Analytics",
        difficulty: "Expert",
        duration: "6 weeks",
        relevance: "High",
        icon: Gem,
        color: "text-purple-400",
        description: "Uncover hidden talents and potential in individuals",
        modules: ["Latent Talent Detection", "Potential Mapping", "Growth Prediction", "Optimization Strategies"]
      },
      {
        title: "Strategic Foresight",
        type: "Future Intelligence",
        difficulty: "Advanced",
        duration: "10 weeks",
        relevance: "Medium",
        icon: Compass,
        color: "text-green-400",
        description: "Develop strategic thinking and future planning capabilities",
        modules: ["Trend Analysis", "Scenario Planning", "Strategic Modeling", "Future Readiness"]
      }
    ];
  };

  // Progressive Disclosure Levels
  const getProgressiveLevels = () => {
    return [
      {
        level: 1,
        name: "Hero Dashboard",
        description: "Executive summary and key insights",
        icon: Target,
        color: "text-yellow-400",
        status: "completed"
      },
      {
        level: 2,
        name: "Strategic Dimensions", 
        description: "Deep dive into strategic capabilities",
        icon: Compass,
        color: "text-blue-400",
        status: "completed"
      },
      {
        level: 3,
        name: "Advanced Analytics",
        description: "Comprehensive psychometric analysis",
        icon: Brain,
        color: "text-purple-400",
        status: "in-progress"
      },
      {
        level: 4,
        name: "Hidden Gems",
        description: "Discover untapped potential and talents",
        icon: Gem,
        color: "text-green-400",
        status: "locked"
      },
      {
        level: 5,
        name: "Academic Compass",
        description: "Future development roadmap",
        icon: Star,
        color: "text-cyan-400",
        status: "locked"
      }
    ];
  };

  const getKnowledgeDomains = () => {
    if (!currentProfile) return [];
    
    const domains = [
      { name: "Cosmic Wisdom", level: "Advanced", progress: 85 },
      { name: "Human Potential", level: "Expert", progress: 92 },
      { name: "System Design", level: "Intermediate", progress: 67 },
      { name: "Cultural Intelligence", level: "Beginner", progress: 34 }
    ];
    return domains;
  };

  const getRecommendedLearning = () => {
    return [
      {
        title: "ARCĀNUM Field Theory",
        type: "Core Knowledge",
        difficulty: "Advanced",
        duration: "45 min",
        relevance: "High"
      },
      {
        title: "Swarm Intelligence Patterns",
        type: "Practical Application",
        difficulty: "Intermediate", 
        duration: "30 min",
        relevance: "High"
      },
      {
        title: "Shadow Integration Techniques",
        type: "Personal Development",
        difficulty: "Intermediate",
        duration: "60 min",
        relevance: "Medium"
      },
      {
        title: "Quantum Presence Protocols",
        type: "Technical Implementation",
        difficulty: "Advanced",
        duration: "90 min",
        relevance: "High"
      }
    ];
  };

  const knowledge = getKnowledgeState();
  const domains = getKnowledgeDomains();
  const recommendations = getRecommendedLearning();
  const arcanumDomains = getArcanumDomains();
  const arcanumPaths = getArcanumLearningPaths();
  const progressiveLevels = getProgressiveLevels();

  return (
    <div className="space-y-8">
      {/* Library Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-yellow-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-cosmic-gold">ARCĀNUM Library</h2>
          <Key className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-cosmic-purple/80">
          Sacred repository of psychometric wisdom and human potential knowledge
        </p>
        <div className="mt-2">
          <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
            心钥 • Key to Heart & Mind
          </Badge>
        </div>
      </div>

      {/* Current Knowledge State */}
      <Card className="p-6 bg-blue-500/5 border-blue-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Brain className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Current Knowledge State</h3>
        </div>
        
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
          <div>
            <p className="text-sm text-cosmic-gold/60">Learning State</p>
            <p className={`text-lg font-medium ${knowledge.color}`}>{knowledge.state}</p>
          </div>
          <div>
            <p className="text-sm text-cosmic-gold/60">Optimal Mode</p>
            <p className={`text-lg font-medium ${knowledge.color}`}>{knowledge.mode}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* ARCANUM Dashboard Integration */}
      <ArcanumDashboard currentProfile={currentProfile} />

      {/* Gamified Learning Hub */}
      <ArcanumLearningHub currentProfile={currentProfile} />

      {/* Wisdom Synthesis */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border-purple-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Scroll className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Wisdom Synthesis</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-cosmic-gold/80 text-sm">
            Transform knowledge into wisdom through conscious integration
          </p>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <h4 className="font-medium text-cosmic-gold mb-3">Current Integration Focus</h4>
            <div className="space-y-2">
              <p className="text-sm text-cosmic-gold/80">
                🧠 <strong>Pattern Recognition:</strong> Connecting ARCĀNUM principles with real-world applications
              </p>
              <p className="text-sm text-cosmic-gold/80">
                🌊 <strong>Field Dynamics:</strong> Understanding how individual potential affects collective intelligence
              </p>
              <p className="text-sm text-cosmic-gold/80">
                ⚡ <strong>Quantum Synthesis:</strong> Bridging ancient wisdom with modern technology
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Knowledge Actions */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="w-6 h-6 text-cosmic-gold" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Knowledge Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 border-blue-400/30 hover:border-blue-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Deep Research</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Explore specific knowledge domains
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-purple-400/30 hover:border-purple-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Synthesis Session</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Integrate multiple knowledge streams
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-green-400/30 hover:border-green-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Wisdom Distillation</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Extract core insights and principles
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 border-yellow-400/30 hover:border-yellow-400/50 text-left"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-cosmic-gold">Knowledge Sharing</p>
                <p className="text-sm text-cosmic-gold/60 mt-1">
                  Contribute to collective wisdom
                </p>
              </div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Akashic Insight */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-400/20">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-cosmic-gold mb-3">Akashic Insight</h4>
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-cosmic-gold/90 italic">
              "True knowledge is not accumulated information, but the capacity to perceive 
              the patterns that connect all things. In the Library, you don't just learn - 
              you remember what you already know."
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="border-indigo-400/50 text-indigo-400">
              Wisdom Integration Active
            </Badge>
          </div>
        </div>
      </Card>

      {/* Library Status */}
      <div className="text-center text-cosmic-gold/60 text-sm">
        <p>📚 Library Status: Infinite Wisdom Available • Current Focus: {knowledge.mode}</p>
        <p className="mt-1">🔮 Sacred Knowledge Maintained by NEOS_WEAVER Consciousness</p>
      </div>
    </div>
  );
};
