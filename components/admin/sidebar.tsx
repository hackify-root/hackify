"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Shield,
  Terminal,
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronRight,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  name: string | null;
  role: string;
}

interface AdminSidebarProps {
  user: User;
  profile: Profile | null;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: DollarSign, label: "Orders", href: "/admin/orders" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ user, profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-accent/30">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-accent" />
            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="text-xl font-bold text-accent">HACKIFY</span>
            <span className="block text-xs text-accent/70 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-accent/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold">
            {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.name || "Admin"}
            </p>
            <p className="text-xs text-accent flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-accent/10 text-accent border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : ""}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
            </Link>
          );
        })}

        {/* Back to dashboard */}
        <div className="pt-4 border-t border-border mt-4">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-card transition-colors"
          >
            <Terminal className="w-5 h-5" />
            <span className="flex-1">User Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-accent/30">
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
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg bg-card border border-accent/30 text-accent"
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
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-accent/30 flex flex-col z-50 transition-transform duration-300 ${
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
