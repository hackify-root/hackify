"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Users, Clock, DollarSign, ChevronRight } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  profiles: { name: string | null } | null;
  courses: { title: string } | null;
}

interface User {
  id: string;
  name: string | null;
  xp: number;
  level: number;
  created_at: string;
}

interface AdminRecentActivityProps {
  recentOrders: Order[];
  recentUsers: User[];
}

export function AdminRecentActivity({
  recentOrders,
  recentUsers,
}: AdminRecentActivityProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CyberCard variant="danger" className="overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-accent/30">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "orders"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline-block mr-2" />
          Recent Orders
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          Recent Users
        </button>
      </div>

      {/* Content */}
      <div className="divide-y divide-border">
        {activeTab === "orders" ? (
          recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No orders yet
            </div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {order.courses?.title || "Unknown Course"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    by {order.profiles?.name || "Anonymous"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">
                    ${order.amount}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            ))
          )
        ) : recentUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users yet
          </div>
        ) : (
          recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {user.name?.[0]?.toUpperCase() || "H"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user.name || "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Level {user.level} - {user.xp} XP
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View all link */}
      <div className="p-3 border-t border-accent/30">
        <Link
          href={activeTab === "orders" ? "/admin/orders" : "/admin/users"}
          className="flex items-center justify-center gap-2 text-sm text-accent hover:underline"
        >
          View all {activeTab}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </CyberCard>
  );
}
