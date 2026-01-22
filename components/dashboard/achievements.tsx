"use client";

import { Trophy, Star, Zap, Shield, Target, Award } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface Profile {
  id: string;
  name: string | null;
  xp: number;
  level: number;
}

interface DashboardAchievementsProps {
  profile: Profile | null;
}

const achievements = [
  {
    id: "first_login",
    icon: Star,
    title: "First Steps",
    description: "Complete your first login",
    xpRequired: 0,
    color: "text-primary",
  },
  {
    id: "level_5",
    icon: Zap,
    title: "Rising Star",
    description: "Reach level 5",
    xpRequired: 5000,
    color: "text-neon-cyan",
  },
  {
    id: "level_10",
    icon: Shield,
    title: "Cyber Guardian",
    description: "Reach level 10",
    xpRequired: 10000,
    color: "text-neon-purple",
  },
  {
    id: "level_20",
    icon: Target,
    title: "Elite Hacker",
    description: "Reach level 20",
    xpRequired: 20000,
    color: "text-accent",
  },
  {
    id: "level_50",
    icon: Trophy,
    title: "Legendary",
    description: "Reach level 50",
    xpRequired: 50000,
    color: "text-primary",
  },
  {
    id: "level_100",
    icon: Award,
    title: "Master Hacker",
    description: "Reach level 100",
    xpRequired: 100000,
    color: "text-neon-cyan",
  },
];

export function DashboardAchievements({ profile }: DashboardAchievementsProps) {
  const currentXP = profile?.xp || 0;

  return (
    <CyberCard className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Achievements
      </h2>

      <div className="space-y-3">
        {achievements.map((achievement) => {
          const isUnlocked = currentXP >= achievement.xpRequired;
          const progress = Math.min((currentXP / achievement.xpRequired) * 100, 100);

          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                isUnlocked
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isUnlocked
                      ? `bg-primary/20 ${achievement.color}`
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {isUnlocked && (
                  <div className="text-primary">
                    <Star className="w-5 h-5 fill-primary" />
                  </div>
                )}
              </div>

              {/* Progress bar for locked achievements */}
              {!isUnlocked && achievement.xpRequired > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/50 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {currentXP.toLocaleString()} / {achievement.xpRequired.toLocaleString()} XP
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CyberCard>
  );
}
