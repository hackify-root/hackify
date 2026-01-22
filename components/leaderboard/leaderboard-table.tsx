"use client";

import { Zap, TrendingUp } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface User {
  id: string;
  name: string | null;
  xp: number;
  level: number;
  avatar_url: string | null;
}

interface LeaderboardTableProps {
  users: User[];
  startRank: number;
  currentUserId?: string;
}

export function LeaderboardTable({
  users,
  startRank,
  currentUserId,
}: LeaderboardTableProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <CyberCard className="overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Rankings</h2>
      </div>

      <div className="divide-y divide-border">
        {users.map((user, index) => {
          const rank = startRank + index;
          const isCurrentUser = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 transition-colors ${
                isCurrentUser
                  ? "bg-primary/10 border-l-2 border-primary"
                  : "hover:bg-muted/30"
              }`}
            >
              {/* Rank */}
              <div className="w-10 text-center">
                <span
                  className={`text-lg font-bold ${
                    isCurrentUser ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {rank}
                </span>
              </div>

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCurrentUser
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {user.name?.[0]?.toUpperCase() || "H"}
              </div>

              {/* Name & Level */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${
                    isCurrentUser ? "text-primary" : "text-foreground"
                  }`}
                >
                  {user.name || "Anonymous"}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-primary">(You)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Level {user.level}
                </p>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    isCurrentUser ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    isCurrentUser ? "text-primary" : "text-foreground"
                  }`}
                >
                  {user.xp.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </CyberCard>
  );
}
