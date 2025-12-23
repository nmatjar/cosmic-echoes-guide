import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Brain, 
  Target, 
  Gem, 
  Star, 
  Compass,
  TrendingUp,
  Users,
  Zap,
  Key,
  ChevronRight,
  Lock,
  CheckCircle,
  Clock
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";
import { arcanumService, ArcanumVector } from "@/services/arcanumService";

interface ArcanumDashboardProps {
  currentProfile?: UserProfile;
}

export const ArcanumDashboard = ({ currentProfile }: ArcanumDashboardProps) => {
  const [vectors, setVectors] = useState<ArcanumVector | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState<Record<number, Record<string, unknown>>>({});
  const [loadingLevel, setLoadingLevel] = useState<number | null>(null);

  useEffect(() => {
    if (currentProfile) {
      const generatedVectors = arcanumService.generateVectorsFromProfile(currentProfile);
      setVectors(generatedVectors);
      
      // Auto-load Level 1
      loadLevel(1, generatedVectors);
    }
  }, [currentProfile]);

  const loadLevel = async (level: number, vectorData?: ArcanumVector) => {
    if (!vectorData && !vectors) return;
    
    setLoadingLevel(level);
    const useVectors = vectorData || vectors!;
    
    try {
      let data;
      switch (level) {
        case 1:
          data = arcanumService.generateHeroDashboard(useVectors);
          break;
        case 2:
          data = arcanumService.generateStrategicDimensions(useVectors);
          break;
        case 3:
          data = arcanumService.generateAdvancedAnalytics(useVectors);
          break;
        case 4:
          data = arcanumService.generateHiddenGems(useVectors);
          break;
        case 5:
          data = arcanumService.generateAcademicCompass(useVectors);
          break;
        default:
          data = {};
      }
      
      setLevelData(prev => ({ ...prev, [level]: data }));
      setCurrentLevel(level);
    } catch (error) {
      console.error(`Error loading level ${level}:`, error);
    } finally {
      setLoadingLevel(null);
    }
  };

  const getLevelStatus = (level: number) => {
    if (levelData[level]) return "completed";
    if (loadingLevel === level) return "loading";
    if (level <= currentLevel + 1) return "available";
    return "locked";
  };

  const levels = [
    {
      level: 1,
      name: "Hero Dashboard",
      description: "Executive summary and key insights",
      icon: Target,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30"
    },
    {
      level: 2,
      name: "Strategic Dimensions",
      description: "Deep dive into strategic capabilities",
      icon: Compass,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30"
    },
    {
      level: 3,
      name: "Advanced Analytics",
      description: "Comprehensive psychometric analysis",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30"
    },
    {
      level: 4,
      name: "Hidden Gems",
      description: "Discover untapped potential and talents",
      icon: Gem,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30"
    },
    {
      level: 5,
      name: "Academic Compass",
      description: "Future development roadmap",
      icon: Star,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30"
    }
  ];

  if (!currentProfile) {
    return (
      <Card className="p-8 text-center bg-gradient-to-r from-yellow-500/5 to-purple-500/5 border-yellow-400/20">
        <Key className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-cosmic-gold mb-2">ARCĀNUM Analysis</h3>
        <p className="text-cosmic-gold/70 mb-4">
          Create your cosmic profile to unlock psychometric insights and strategic analysis
        </p>
        <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
          Profile Required
        </Badge>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ARCANUM Header */}
      <Card className="p-6 bg-gradient-to-r from-yellow-500/5 to-purple-500/5 border-yellow-400/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-purple-400/20 flex items-center justify-center">
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cosmic-gold">ARCĀNUM Analysis</h2>
            <p className="text-cosmic-gold/70">Psychometric Intelligence & Strategic Insights</p>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
              心钥 • {currentProfile.name}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        {levelData[1] && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-black/20 p-4 rounded-lg">
              <p className="text-sm text-cosmic-gold/60">Dominant Archetype</p>
              <p className="text-lg font-medium text-cosmic-gold">
                {String(levelData[1].dominantArchetype || 'Analyzing...')}
              </p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <p className="text-sm text-cosmic-gold/60">Leadership Potential</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-cosmic-gold">
                  {Number(levelData[1].leadershipPotential || 0)}/100
                </p>
                <Progress value={Number(levelData[1].leadershipPotential || 0)} className="flex-1" />
              </div>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <p className="text-sm text-cosmic-gold/60">Analysis Progress</p>
              <p className="text-lg font-medium text-cosmic-gold">
                {Object.keys(levelData).length}/5 Levels
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Progressive Disclosure Levels */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <h3 className="text-xl font-semibold text-cosmic-gold mb-4">Progressive Analysis Levels</h3>
        
        <div className="space-y-4">
          {levels.map((level) => {
            const IconComponent = level.icon;
            const status = getLevelStatus(level.level);
            const isActive = currentLevel === level.level;
            
            return (
              <div 
                key={level.level}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isActive ? `${level.bgColor} ${level.borderColor}` : 
                  status === 'completed' ? 'bg-green-400/5 border-green-400/30' :
                  status === 'available' ? 'bg-cosmic-purple/5 border-cosmic-purple/20 hover:border-cosmic-purple/40' :
                  'bg-gray-400/5 border-gray-400/20'
                }`}
                onClick={() => {
                  if (status === 'available' || status === 'completed') {
                    loadLevel(level.level);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    status === 'completed' ? 'bg-green-400/20' :
                    status === 'loading' ? 'bg-yellow-400/20' :
                    status === 'available' ? level.bgColor :
                    'bg-gray-400/20'
                  }`}>
                    {status === 'loading' ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400" />
                    ) : status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : status === 'locked' ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <IconComponent className={`w-6 h-6 ${level.color}`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-cosmic-gold/60">Level {level.level}</span>
                      <h4 className="font-medium text-cosmic-gold">{level.name}</h4>
                    </div>
                    <p className="text-sm text-cosmic-gold/70">{level.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${
                        status === 'completed' ? 'border-green-400/50 text-green-400' :
                        status === 'loading' ? 'border-yellow-400/50 text-yellow-400' :
                        status === 'available' ? 'border-blue-400/50 text-blue-400' :
                        'border-gray-400/50 text-gray-400'
                      }`}
                    >
                      {status === 'completed' ? 'Completed' :
                       status === 'loading' ? 'Loading...' :
                       status === 'available' ? 'Available' :
                       'Locked'}
                    </Badge>
                    {(status === 'available' || status === 'completed') && (
                      <ChevronRight className="w-4 h-4 text-cosmic-gold/40" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Current Level Content */}
      {levelData[currentLevel] && (
        <Card className="p-6 bg-gradient-to-r from-cosmic-purple/5 to-cosmic-blue/5 border-cosmic-purple/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/20 flex items-center justify-center">
              {React.createElement(levels[currentLevel - 1].icon, { 
                className: `w-5 h-5 ${levels[currentLevel - 1].color}` 
              })}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-cosmic-gold">
                Level {currentLevel}: {levels[currentLevel - 1].name}
              </h3>
              <p className="text-cosmic-gold/70">{levels[currentLevel - 1].description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {currentLevel === 1 && levelData[1] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-medium text-cosmic-gold mb-2">Profile 360°</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Key Strength:</strong> {
                        (levelData[1].profile360 as any)?.keyStrength || 'Strategic thinking and pattern recognition'
                      }</p>
                      <p><strong>Leadership Style:</strong> {
                        (levelData[1].profile360 as any)?.leadershipStyle || 'Collaborative visionary with analytical depth'
                      }</p>
                      <p><strong>Main Motivators:</strong> {
                        (levelData[1].profile360 as any)?.mainMotivators || 'Innovation, impact, and intellectual challenge'
                      }</p>
                    </div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-medium text-cosmic-gold mb-2">Strategic Highlights</h4>
                    <ul className="space-y-1 text-sm">
                      {Array.isArray(levelData[1].strategicHighlights) ? 
                        (levelData[1].strategicHighlights as string[]).map((highlight: string, idx: number) => (
                          <li key={idx} className="text-cosmic-gold/80">• {highlight}</li>
                        )) : 
                        <li className="text-cosmic-gold/80">• Exceptional analytical capabilities with strategic vision</li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentLevel > 1 && (
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-cosmic-gold/80">
                  Detailed analysis data for Level {currentLevel} is available. 
                  This would contain comprehensive insights based on the ARCĀNUM methodology.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-cosmic-purple/20">
            <Button 
              variant="outline" 
              onClick={() => currentLevel > 1 && setCurrentLevel(currentLevel - 1)}
              disabled={currentLevel <= 1}
              className="border-cosmic-purple/30"
            >
              Previous Level
            </Button>
            <Button 
              onClick={() => {
                if (currentLevel < 5 && !levelData[currentLevel + 1]) {
                  loadLevel(currentLevel + 1);
                } else if (levelData[currentLevel + 1]) {
                  setCurrentLevel(currentLevel + 1);
                }
              }}
              disabled={currentLevel >= 5}
              className="bg-gradient-to-r from-cosmic-purple to-cosmic-pink"
            >
              {levelData[currentLevel + 1] ? 'Next Level' : 'Unlock Next Level'}
            </Button>
          </div>
        </Card>
      )}

      {/* ARCANUM Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-400/20">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-cosmic-gold mb-3">ARCĀNUM Insight</h4>
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-cosmic-gold/90 italic">
              "The key to understanding human potential lies not in what we see on the surface, 
              but in the hidden patterns that connect mind, heart, and purpose. ARCĀNUM reveals 
              the strategic architecture of your unique capabilities."
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="border-indigo-400/50 text-indigo-400">
              Psychometric Intelligence Active
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
