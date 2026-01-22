"use client";

import { Trophy, Medal } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface User {
  id: string;
  name: string | null;
  xp: number;
  level: number;
  avatar_url: string | null;
}

interface LeaderboardPodiumProps {
  top3: User[];
  currentUserId?: string;
}

export function LeaderboardPodium({ top3, currentUserId }: LeaderboardPodiumProps) {
  if (top3.length === 0) {
    return null;
  }

  const podiumOrder = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
  const podiumHeights = ["h-32", "h-40", "h-24"];
  const podiumColors = [
    "from-gray-400 to-gray-500", // Silver
    "from-yellow-400 to-yellow-600", // Gold
    "from-amber-600 to-amber-800", // Bronze
  ];
  const borderColors = [
    "border-gray-400",
    "border-yellow-400",
    "border-amber-600",
  ];

  return (
    <CyberCard className="p-6">
      <div className="flex items-end justify-center gap-4 md:gap-8">
        {podiumOrder.map((index, position) => {
          const user = top3[index];
          if (!user) return null;

          const isCurrentUser = user.id === currentUserId;
          const rank = index + 1;

          return (
            <div
              key={user.id}
              className={`flex flex-col items-center ${
                position === 1 ? "order-2" : position === 0 ? "order-1" : "order-3"
              }`}
            >
              {/* Avatar */}
              <div className="relative mb-3">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderColors[index]} flex items-center justify-center text-2xl font-bold ${
                    isCurrentUser
                      ? "bg-primary/20 text-primary"
                      : "bg-card text-foreground"
                  }`}
                >
                  {user.name?.[0]?.toUpperCase() || "H"}
                </div>
                
                {/* Rank badge */}
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-b ${podiumColors[index]} flex items-center justify-center shadow-lg`}
                >
                  {rank === 1 ? (
                    <Trophy className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-white">{rank}</span>
                  )}
                </div>
              </div>

              {/* Name */}
              <p
                className={`text-sm font-semibold text-center mb-1 ${
                  isCurrentUser ? "text-primary" : "text-foreground"
                }`}
              >
                {user.name || "Anonymous"}
              </p>

              {/* XP */}
              <p className="text-xs text-muted-foreground mb-3">
                {user.xp.toLocaleString()} XP
              </p>

              {/* Podium */}
              <div
                className={`w-20 md:w-28 ${podiumHeights[index]} bg-gradient-to-t ${podiumColors[index]} rounded-t-lg flex items-start justify-center pt-2`}
              >
                <span className="text-2xl md:text-3xl font-bold text-white/80">
                  {rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </CyberCard>
  );
}
