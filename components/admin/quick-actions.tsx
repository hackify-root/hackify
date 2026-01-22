"use client";

import Link from "next/link";
import { Plus, Users, BookOpen, Settings, BarChart3 } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

const quickActions = [
  {
    icon: Plus,
    label: "Add New Course",
    description: "Create a new course with chapters and videos",
    href: "/admin/courses/new",
    variant: "primary" as const,
  },
  {
    icon: Users,
    label: "Manage Users",
    description: "View, edit, or remove user accounts",
    href: "/admin/users",
    variant: "secondary" as const,
  },
  {
    icon: BarChart3,
    label: "View Analytics",
    description: "Check platform performance metrics",
    href: "/admin/analytics",
    variant: "secondary" as const,
  },
  {
    icon: Settings,
    label: "Site Settings",
    description: "Configure platform settings",
    href: "/admin/settings",
    variant: "secondary" as const,
  },
];

export function AdminQuickActions() {
  return (
    <CyberCard variant="danger" className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>

      <div className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <action.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CyberCard>
  );
}
