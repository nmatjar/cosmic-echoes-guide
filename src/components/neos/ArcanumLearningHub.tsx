import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Star,
  Zap,
  Target,
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Award,
  TrendingUp,
  Clock,
  Users,
  Brain,
  Crown,
  Gem,
  Flame,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { UserProfile } from "@/engine/userProfile";
import { 
  arcanumLearningService, 
  LearningPath, 
  LearningModule, 
  Badge as LearningBadge, 
  UserProgress 
} from "@/services/arcanumLearningService";

interface ArcanumLearningHubProps {
  currentProfile?: UserProfile;
}

export const ArcanumLearningHub = ({ currentProfile }: ArcanumLearningHubProps) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [availableBadges, setAvailableBadges] = useState<LearningBadge[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      const progress = arcanumLearningService.getUserProgress(currentProfile.id);
      const paths = arcanumLearningService.getLearningPaths();
      const badges = arcanumLearningService.getBadges();
      
      setUserProgress(progress);
      setLearningPaths(paths);
      setAvailableBadges(badges);
    }
  }, [currentProfile]);

  const handleStartModule = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const handleCompleteModule = (moduleId: string) => {
    if (!currentProfile) return;
    
    const result = arcanumLearningService.completeModule(currentProfile.id, moduleId);
    
    // Update user progress
    const updatedProgress = arcanumLearningService.getUserProgress(currentProfile.id);
    setUserProgress(updatedProgress);
    
    // Show completion notification
    if (result.badgesEarned.length > 0) {
      // Show badge earned notification
      console.log('Badges earned:', result.badgesEarned);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400/50';
      case 'Rare': return 'text-blue-400 border-blue-400/50';
      case 'Epic': return 'text-purple-400 border-purple-400/50';
      case 'Legendary': return 'text-yellow-400 border-yellow-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'text': return <BookOpen className="w-4 h-4" />;
      case 'interactive': return <Target className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      case 'exercise': return <Zap className="w-4 h-4" />;
      case 'case-study': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (!currentProfile || !userProgress) {
    return (
      <Card className="p-8 text-center bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-400/20">
        <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-cosmic-gold mb-2">ARCĀNUM Learning Hub</h3>
        <p className="text-cosmic-gold/70 mb-4">
          Create your cosmic profile to access gamified learning paths and earn badges
        </p>
        <Badge variant="outline" className="border-purple-400/50 text-purple-400">
          Profile Required
        </Badge>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Progress Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-400/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cosmic-gold">Learning Progress</h2>
            <p className="text-cosmic-gold/70">Level {userProgress.level} • {userProgress.totalXP} XP</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="border-orange-400/50 text-orange-400">
              <Flame className="w-3 h-3 mr-1" />
              {userProgress.streakDays} day streak
            </Badge>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">{userProgress.level}</p>
            <p className="text-xs text-cosmic-gold/60">Level</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-400">{userProgress.badges.length}</p>
            <p className="text-xs text-cosmic-gold/60">Badges</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">{userProgress.completedModules.length}</p>
            <p className="text-xs text-cosmic-gold/60">Modules</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-400">{userProgress.totalXP}</p>
            <p className="text-xs text-cosmic-gold/60">Total XP</p>
          </div>
        </div>

        {/* XP Progress to Next Level */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-cosmic-gold/60 mb-1">
            <span>Level {userProgress.level}</span>
            <span>Level {userProgress.level + 1}</span>
          </div>
          <Progress 
            value={(userProgress.totalXP % 100)} 
            className="h-2"
          />
          <p className="text-xs text-cosmic-gold/60 mt-1">
            {arcanumLearningService.getXPForNextLevel(userProgress.totalXP)} XP to next level
          </p>
        </div>
      </Card>

      {/* Earned Badges */}
      <Card className="p-6 bg-gradient-to-r from-yellow-500/5 to-purple-500/5 border-yellow-400/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-cosmic-gold">Earned Badges</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowBadges(!showBadges)}
            className="border-yellow-400/30"
          >
            {showBadges ? 'Hide All' : 'View All'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {userProgress.badges.slice(0, showBadges ? undefined : 4).map((badge) => (
            <div key={badge.id} className={`bg-black/20 p-3 rounded-lg border ${getRarityColor(badge.rarity)} text-center`}>
              <div className="text-2xl mb-2">{badge.icon}</div>
              <p className="font-medium text-cosmic-gold text-sm">{badge.name}</p>
              <p className="text-xs text-cosmic-gold/60">{badge.rarity}</p>
            </div>
          ))}
          
          {!showBadges && userProgress.badges.length > 4 && (
            <div className="bg-black/20 p-3 rounded-lg border border-gray-400/30 text-center flex items-center justify-center">
              <p className="text-cosmic-gold/60">+{userProgress.badges.length - 4} more</p>
            </div>
          )}
        </div>
      </Card>

      {/* Learning Paths */}
      <Card className="p-6 bg-cosmic-purple/5 border-cosmic-purple/20">
        <div className="flex items-center gap-4 mb-4">
          <BarChart3 className="w-6 h-6 text-cosmic-purple" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Learning Paths</h3>
        </div>

        <div className="space-y-4">
          {learningPaths.map((path) => {
            const completedModules = path.modules.filter(m => 
              userProgress.completedModules.includes(m.id)
            ).length;
            const progressPercent = (completedModules / path.modules.length) * 100;

            return (
              <div key={path.id} className="bg-black/20 p-4 rounded-lg border border-cosmic-purple/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-cosmic-gold mb-1">{path.title}</h4>
                    <p className="text-sm text-cosmic-gold/70 mb-2">{path.description}</p>
                    <div className="flex items-center gap-4 text-xs text-cosmic-gold/60">
                      <span><Clock className="w-3 h-3 inline mr-1" />{path.totalDuration} min</span>
                      <span><Target className="w-3 h-3 inline mr-1" />{path.difficulty}</span>
                      <span><BookOpen className="w-3 h-3 inline mr-1" />{path.modules.length} modules</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-purple-400/50 text-purple-400 mb-2">
                      {Math.round(progressPercent)}% Complete
                    </Badge>
                    <div className="w-24">
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{path.badge.icon}</div>
                    <span className="text-sm text-cosmic-gold/80">Earn: {path.badge.name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
                    className="border-purple-400/30"
                  >
                    {selectedPath?.id === path.id ? 'Hide Modules' : 'View Modules'}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Expanded Modules */}
                {selectedPath?.id === path.id && (
                  <div className="mt-4 space-y-3 border-t border-cosmic-purple/20 pt-4">
                    {path.modules.map((module) => {
                      const isCompleted = userProgress.completedModules.includes(module.id);
                      const isAvailable = module.prerequisites.every(prereq => 
                        userProgress.completedModules.includes(prereq)
                      );

                      return (
                        <div key={module.id} className={`p-3 rounded-lg border ${
                          isCompleted ? 'bg-green-400/5 border-green-400/30' :
                          isAvailable ? 'bg-blue-400/5 border-blue-400/30' :
                          'bg-gray-400/5 border-gray-400/30'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-green-400/20' :
                                isAvailable ? 'bg-blue-400/20' :
                                'bg-gray-400/20'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : isAvailable ? (
                                  <Play className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-cosmic-gold text-sm">{module.title}</h5>
                                <p className="text-xs text-cosmic-gold/60">{module.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-cosmic-gold/60">{module.duration} min</span>
                                  <span className="text-xs text-cosmic-gold/60">•</span>
                                  <span className="text-xs text-cosmic-gold/60">{module.xpReward} XP</span>
                                  <span className="text-xs text-cosmic-gold/60">•</span>
                                  <Badge variant="outline" className="text-xs border-cosmic-purple/30 text-cosmic-purple">
                                    {module.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              disabled={!isAvailable || isCompleted}
                              onClick={() => handleStartModule(module)}
                              className={
                                isCompleted ? 'bg-green-400/20 text-green-400' :
                                isAvailable ? 'bg-blue-400/20 text-blue-400' :
                                'bg-gray-400/20 text-gray-400'
                              }
                            >
                              {isCompleted ? 'Completed' : isAvailable ? 'Start' : 'Locked'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Module Content Viewer */}
      {selectedModule && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-xl font-semibold text-cosmic-gold">{selectedModule.title}</h3>
                <p className="text-cosmic-gold/70">{selectedModule.description}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedModule(null)}
              className="border-blue-400/30"
            >
              Close
            </Button>
          </div>

          <div className="space-y-4">
            {selectedModule.content.map((content, index) => (
              <div key={content.id} className="bg-black/20 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                      {getContentTypeIcon(content.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-cosmic-gold">{content.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-cosmic-gold/60">
                        <span>{content.duration} min</span>
                        <span>•</span>
                        <span>{content.xpReward} XP</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-400">
                          {content.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Simulate completing content
                      console.log(`Completed content: ${content.id}`);
                    }}
                    className="bg-blue-400/20 text-blue-400"
                  >
                    {content.completed ? 'Completed' : 'Start'}
                  </Button>
                </div>
                <p className="text-sm text-cosmic-gold/80">{content.content}</p>
              </div>
            ))}

            <div className="flex justify-between pt-4 border-t border-blue-400/20">
              <div className="text-sm text-cosmic-gold/60">
                Module Progress: {selectedModule.content.filter(c => c.completed).length}/{selectedModule.content.length}
              </div>
              <Button 
                onClick={() => {
                  handleCompleteModule(selectedModule.id);
                  setSelectedModule(null);
                }}
                className="bg-gradient-to-r from-blue-400 to-purple-400"
              >
                Complete Module (+{selectedModule.xpReward} XP)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Available Badges to Earn */}
      <Card className="p-6 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border-cyan-400/20">
        <div className="flex items-center gap-4 mb-4">
          <Star className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cosmic-gold">Available Badges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableBadges
            .filter(badge => !userProgress.badges.some(earned => earned.id === badge.id))
            .slice(0, 4)
            .map((badge) => (
              <div key={badge.id} className={`bg-black/20 p-4 rounded-lg border ${getRarityColor(badge.rarity)}`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-cosmic-gold">{badge.name}</h4>
                    <p className="text-sm text-cosmic-gold/70 mb-2">{badge.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity} • {badge.xpValue} XP
                      </Badge>
                      <span className="text-xs text-cosmic-gold/60">
                        {badge.requirements.length} requirement{badge.requirements.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
