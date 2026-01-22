"use client";

import { Trophy, Zap, BookOpen, Video, Clock, Flame } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface DashboardStatsProps {
  level: number;
  xp: number;
  totalCourses: number;
  completedVideos: number;
  totalWatchTime: number;
  streak: number;
}

export function DashboardStats({
  level,
  xp,
  totalCourses,
  completedVideos,
  totalWatchTime,
  streak,
}: DashboardStatsProps) {
  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const stats = [
    {
      icon: Trophy,
      label: "Level",
      value: level.toString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: Zap,
      label: "Total XP",
      value: xp.toLocaleString(),
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
      borderColor: "border-neon-cyan/30",
    },
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: totalCourses.toString(),
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/30",
    },
    {
      icon: Video,
      label: "Videos Completed",
      value: completedVideos.toString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: Clock,
      label: "Watch Time",
      value: formatWatchTime(totalWatchTime),
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
      borderColor: "border-neon-cyan/30",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: `${streak} days`,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <CyberCard key={stat.label} className="p-4">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </CyberCard>
      ))}
    </div>
  );
}
