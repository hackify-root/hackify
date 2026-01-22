"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Shield,
  Terminal,
  LayoutDashboard,
  BookOpen,
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  name: string | null;
  xp: number;
  level: number;
  avatar_url: string | null;
  role: string;
}

interface DashboardSidebarProps {
  user: User;
  profile: Profile | null;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
  { icon: Trophy, label: "Leaderboard", href: "/dashboard/leaderboard" },
  { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/chat" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Calculate level progress
  const xpForCurrentLevel = (profile?.level || 1) * 1000;
  const xpProgress = ((profile?.xp || 0) % 1000) / 10;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary text-glow-sm">
            HACKIFY
          </span>
        </Link>
      </div>

      {/* User profile section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "H"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {profile?.name || "Hacker"}
              </p>
              {profile?.role === "admin" && (
                <Crown className="w-3 h-3 text-accent" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Level {profile?.level || 1}
            </span>
            <span className="text-primary">
              {profile?.xp || 0} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {1000 - ((profile?.xp || 0) % 1000)} XP to Level {(profile?.level || 1) + 1}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary" />
              )}
            </Link>
          );
        })}

        {/* Admin link */}
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              pathname.startsWith("/admin")
                ? "bg-accent/10 text-accent border border-accent/30"
                : "text-muted-foreground hover:text-accent hover:bg-card"
            }`}
          >
            <Crown className="w-5 h-5" />
            <span className="flex-1">Admin Panel</span>
            {pathname.startsWith("/admin") && (
              <ChevronRight className="w-4 h-4 text-accent" />
            )}
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg bg-card border border-border text-foreground"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button on mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
