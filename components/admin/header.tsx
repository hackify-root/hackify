"use client";

import type { User } from "@supabase/supabase-js";
import { Bell, Search, Crown } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  role: string;
}

interface AdminHeaderProps {
  user: User;
  profile: Profile | null;
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-accent/30 flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Title */}
      <div className="ml-12 lg:ml-0">
        <h1 className="text-lg font-bold text-accent flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Admin Panel
        </h1>
      </div>

      {/* Right side - Search & notifications */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-input border border-accent/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          />
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold">
            {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
