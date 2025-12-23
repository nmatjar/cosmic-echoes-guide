/**
 * ARCĀNUM Learning Service - Gamified Learning System
 * Manages learning paths, progress tracking, badges, and interactive content
 */

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: LearningContent[];
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prerequisites: string[];
  badge?: Badge;
  xpReward: number;
}

export interface LearningContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'exercise' | 'case-study';
  title: string;
  content: string;
  duration: number;
  xpReward: number;
  completed?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  requirements: string[];
  xpValue: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: LearningModule[];
  totalDuration: number;
  difficulty: string;
  badge: Badge;
  progress: number;
  completedModules: string[];
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  badges: Badge[];
  completedModules: string[];
  currentPaths: string[];
  streakDays: number;
  lastActivity: Date;
}

class ArcanumLearningService {
  private static instance: ArcanumLearningService;

  public static getInstance(): ArcanumLearningService {
    if (!ArcanumLearningService.instance) {
      ArcanumLearningService.instance = new ArcanumLearningService();
    }
    return ArcanumLearningService.instance;
  }

  // Badge definitions
  private badges: Badge[] = [
    {
      id: 'psychometric-novice',
      name: 'Psychometric Novice',
      description: 'Complete your first psychometric analysis module',
      icon: '🧠',
      color: 'text-blue-400',
      rarity: 'Common',
      requirements: ['Complete any psychometric module'],
      xpValue: 100
    },
    {
      id: 'leadership-explorer',
      name: 'Leadership Explorer',
      description: 'Begin your journey into strategic leadership',
      icon: '👑',
      color: 'text-yellow-400',
      rarity: 'Common',
      requirements: ['Complete first leadership module'],
      xpValue: 150
    },
    {
      id: 'pattern-master',
      name: 'Pattern Master',
      description: 'Master the art of behavioral pattern recognition',
      icon: '🔍',
      color: 'text-purple-400',
      rarity: 'Rare',
      requirements: ['Complete 5 pattern analysis exercises'],
      xpValue: 300
    },
    {
      id: 'strategic-visionary',
      name: 'Strategic Visionary',
      description: 'Demonstrate advanced strategic thinking capabilities',
      icon: '🎯',
      color: 'text-green-400',
      rarity: 'Epic',
      requirements: ['Complete Strategic Foresight path', 'Score 90%+ on strategic assessment'],
      xpValue: 500
    },
    {
      id: 'arcanum-master',
      name: 'ARCĀNUM Master',
      description: 'Achieve mastery across all ARCĀNUM domains',
      icon: '🏆',
      color: 'text-gold-400',
      rarity: 'Legendary',
      requirements: ['Complete all learning paths', 'Earn 10+ badges', 'Reach level 20'],
      xpValue: 1000
    },
    {
      id: 'hidden-gems-seeker',
      name: 'Hidden Gems Seeker',
      description: 'Uncover hidden talents and potential in analysis',
      icon: '💎',
      color: 'text-cyan-400',
      rarity: 'Rare',
      requirements: ['Complete Hidden Gems Discovery path'],
      xpValue: 400
    },
    {
      id: 'cultural-navigator',
      name: 'Cultural Navigator',
      description: 'Master cross-cultural intelligence and adaptation',
      icon: '🌍',
      color: 'text-indigo-400',
      rarity: 'Rare',
      requirements: ['Complete Cultural Dynamics modules'],
      xpValue: 350
    },
    {
      id: 'streak-warrior',
      name: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      color: 'text-orange-400',
      rarity: 'Common',
      requirements: ['7 consecutive days of learning activity'],
      xpValue: 200
    }
  ];

  // Learning paths with detailed content
  private learningPaths: LearningPath[] = [
    {
      id: 'psychometric-intelligence',
      title: 'Psychometric Intelligence Mastery',
      description: 'Master the art of human psychological analysis and behavioral prediction',
      totalDuration: 480, // 8 weeks * 60 minutes
      difficulty: 'Intermediate',
      progress: 0,
      completedModules: [],
      badge: this.badges.find(b => b.id === 'pattern-master')!,
      modules: [
        {
          id: 'psych-foundations',
          title: 'Foundations of Psychometric Analysis',
          description: 'Understanding the core principles of psychological measurement',
          duration: 60,
          difficulty: 'Beginner',
          prerequisites: [],
          xpReward: 100,
          content: [
            {
              id: 'psych-intro',
              type: 'video',
              title: 'Introduction to Psychometrics',
              content: 'Comprehensive overview of psychometric principles and applications',
              duration: 15,
              xpReward: 25
            },
            {
              id: 'psych-history',
              type: 'text',
              title: 'Historical Development of Psychometric Science',
              content: 'From ancient personality theories to modern ARCĀNUM methodology',
              duration: 20,
              xpReward: 30
            },
            {
              id: 'psych-quiz-1',
              type: 'quiz',
              title: 'Foundations Assessment',
              content: 'Test your understanding of basic psychometric concepts',
              duration: 15,
              xpReward: 40
            },
            {
              id: 'psych-exercise-1',
              type: 'exercise',
              title: 'Personality Vector Analysis',
              content: 'Practice analyzing personality vectors using ARCĀNUM methodology',
              duration: 10,
              xpReward: 35
            }
          ]
        },
        {
          id: 'behavioral-patterns',
          title: 'Behavioral Pattern Recognition',
          description: 'Learn to identify and interpret complex behavioral patterns',
          duration: 90,
          difficulty: 'Intermediate',
          prerequisites: ['psych-foundations'],
          xpReward: 150,
          content: [
            {
              id: 'pattern-theory',
              type: 'text',
              title: 'Pattern Recognition Theory',
              content: 'Deep dive into behavioral pattern identification methodologies',
              duration: 30,
              xpReward: 40
            },
            {
              id: 'pattern-practice',
              type: 'interactive',
              title: 'Interactive Pattern Analysis',
              content: 'Hands-on practice with real behavioral data sets',
              duration: 45,
              xpReward: 60
            },
            {
              id: 'pattern-case-study',
              type: 'case-study',
              title: 'Executive Leadership Case Study',
              content: 'Analyze behavioral patterns of successful executives',
              duration: 15,
              xpReward: 50
            }
          ]
        }
      ]
    },
    {
      id: 'strategic-leadership',
      title: 'ARCĀNUM Executive Mastery',
      description: 'Complete executive leadership transformation program',
      totalDuration: 720, // 12 weeks * 60 minutes
      difficulty: 'Advanced',
      progress: 0,
      completedModules: [],
      badge: this.badges.find(b => b.id === 'strategic-visionary')!,
      modules: [
        {
          id: 'executive-presence',
          title: 'Executive Presence & Influence',
          description: 'Develop commanding presence and strategic influence',
          duration: 120,
          difficulty: 'Advanced',
          prerequisites: [],
          xpReward: 200,
          content: [
            {
              id: 'presence-fundamentals',
              type: 'video',
              title: 'The Psychology of Executive Presence',
              content: 'Understanding the psychological foundations of leadership presence',
              duration: 30,
              xpReward: 50
            },
            {
              id: 'influence-strategies',
              type: 'interactive',
              title: 'Strategic Influence Techniques',
              content: 'Practice advanced influence and persuasion strategies',
              duration: 60,
              xpReward: 80
            },
            {
              id: 'presence-assessment',
              type: 'quiz',
              title: 'Executive Presence Assessment',
              content: 'Evaluate your current executive presence capabilities',
              duration: 30,
              xpReward: 70
            }
          ]
        }
      ]
    }
  ];

  // Get all available badges
  public getBadges(): Badge[] {
    return this.badges;
  }

  // Get learning paths
  public getLearningPaths(): LearningPath[] {
    return this.learningPaths;
  }

  // Get user progress
  public getUserProgress(userId: string): UserProgress {
    // In a real implementation, this would fetch from a database
    return {
      userId,
      totalXP: 450,
      level: this.calculateLevel(450),
      badges: [
        this.badges.find(b => b.id === 'psychometric-novice')!,
        this.badges.find(b => b.id === 'leadership-explorer')!
      ],
      completedModules: ['psych-foundations'],
      currentPaths: ['psychometric-intelligence'],
      streakDays: 3,
      lastActivity: new Date()
    };
  }

  // Calculate level from XP
  private calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  // Calculate XP needed for next level
  public getXPForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    return (currentLevel * 100) - currentXP;
  }

  // Check if user can earn a badge
  public checkBadgeEligibility(userId: string, badgeId: string): boolean {
    const badge = this.badges.find(b => b.id === badgeId);
    const userProgress = this.getUserProgress(userId);
    
    if (!badge) return false;
    
    // Check if user already has this badge
    if (userProgress.badges.some(b => b.id === badgeId)) return false;
    
    // Check requirements (simplified logic)
    return badge.requirements.every(req => {
      // This would contain more complex logic in a real implementation
      return true;
    });
  }

  // Award badge to user
  public awardBadge(userId: string, badgeId: string): boolean {
    if (this.checkBadgeEligibility(userId, badgeId)) {
      // In a real implementation, this would update the database
      console.log(`Badge ${badgeId} awarded to user ${userId}`);
      return true;
    }
    return false;
  }

  // Complete a learning module
  public completeModule(userId: string, moduleId: string): { xpGained: number; badgesEarned: Badge[] } {
    const module = this.findModuleById(moduleId);
    if (!module) return { xpGained: 0, badgesEarned: [] };

    const xpGained = module.xpReward;
    const badgesEarned: Badge[] = [];

    // Check for badge eligibility after completing module
    this.badges.forEach(badge => {
      if (this.checkBadgeEligibility(userId, badge.id)) {
        badgesEarned.push(badge);
      }
    });

    return { xpGained, badgesEarned };
  }

  // Find module by ID
  private findModuleById(moduleId: string): LearningModule | null {
    for (const path of this.learningPaths) {
      const module = path.modules.find(m => m.id === moduleId);
      if (module) return module;
    }
    return null;
  }

  // Get recommended next modules
  public getRecommendedModules(userId: string): LearningModule[] {
    const userProgress = this.getUserProgress(userId);
    const recommendations: LearningModule[] = [];

    for (const path of this.learningPaths) {
      for (const module of path.modules) {
        // Check if module is not completed and prerequisites are met
        if (!userProgress.completedModules.includes(module.id)) {
          const prerequisitesMet = module.prerequisites.every(prereq => 
            userProgress.completedModules.includes(prereq)
          );
          
          if (prerequisitesMet) {
            recommendations.push(module);
          }
        }
      }
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Get learning statistics
  public getLearningStats(userId: string): {
    totalModulesCompleted: number;
    totalXP: number;
    level: number;
    badgeCount: number;
    streakDays: number;
    averageScore: number;
  } {
    const userProgress = this.getUserProgress(userId);
    
    return {
      totalModulesCompleted: userProgress.completedModules.length,
      totalXP: userProgress.totalXP,
      level: userProgress.level,
      badgeCount: userProgress.badges.length,
      streakDays: userProgress.streakDays,
      averageScore: 87 // This would be calculated from actual quiz/assessment scores
    };
  }
}

export const arcanumLearningService = ArcanumLearningService.getInstance();
