"use client";

import { Trophy, Zap, TrendingUp } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface Profile {
  id: string;
  name: string | null;
  xp: number;
  level: number;
}

interface LeaderboardStatsProps {
  userProfile: Profile;
  userRank: number;
}

export function LeaderboardStats({ userProfile, userRank }: LeaderboardStatsProps) {
  return (
    <CyberCard variant="highlight" glowing className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary">
          {userProfile.name?.[0]?.toUpperCase() || "H"}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-foreground">
            {userProfile.name || "Anonymous"}
          </h2>
          <p className="text-muted-foreground">Your current standing</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Trophy className="w-6 h-6" />
              #{userRank}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Rank
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neon-cyan">
              <Zap className="w-6 h-6" />
              {userProfile.xp.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              XP
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neon-purple">
              <TrendingUp className="w-6 h-6" />
              {userProfile.level}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Level
            </p>
          </div>
        </div>
      </div>
    </CyberCard>
  );
}
