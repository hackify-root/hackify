"use client";

import type { User } from "@supabase/supabase-js";
import { Bell, Search, Zap } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  xp: number;
  level: number;
  avatar_url: string | null;
  role: string;
}

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Search */}
      <div className="flex-1 max-w-md ml-12 lg:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right side - Stats & notifications */}
      <div className="flex items-center gap-4">
        {/* XP indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {profile?.xp || 0} XP
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-card transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User avatar */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
            {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "H"}
          </div>
        </div>
      </div>
    </header>
  );
}
