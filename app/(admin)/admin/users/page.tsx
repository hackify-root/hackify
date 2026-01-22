import { createServerClient } from "@/lib/supabase/server";
import { Users, Crown, Shield, Clock, Zap } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

export default async function AdminUsersPage() {
  const supabase = await createServerClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Manage <span className="text-accent">Users</span>
        </h1>
        <p className="text-muted-foreground">
          View and manage platform users
        </p>
      </div>

      {/* Users list */}
      <CyberCard variant="danger" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/30">
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Level
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  XP
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p>No users yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                          {user.name?.[0]?.toUpperCase() || "H"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {user.level}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-neon-cyan" />
                        <span className="text-neon-cyan font-semibold">
                          {user.xp.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/30 text-accent text-xs rounded">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted border border-border text-muted-foreground text-xs rounded">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}
