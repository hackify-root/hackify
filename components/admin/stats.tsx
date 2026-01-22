"use client";

import { Users, BookOpen, DollarSign, ShoppingCart } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface AdminStatsProps {
  totalUsers: number;
  totalCourses: number;
  totalOrders: number;
  totalRevenue: number;
}

export function AdminStats({
  totalUsers,
  totalCourses,
  totalOrders,
  totalRevenue,
}: AdminStatsProps) {
  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses.toLocaleString(),
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
      borderColor: "border-neon-cyan/30",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/30",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <CyberCard key={stat.label} variant="danger" className="p-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        </CyberCard>
      ))}
    </div>
  );
}
