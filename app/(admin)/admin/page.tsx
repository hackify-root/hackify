import { createServerClient } from "@/lib/supabase/server";
import { AdminStats } from "@/components/admin/stats";
import { AdminRecentActivity } from "@/components/admin/recent-activity";
import { AdminQuickActions } from "@/components/admin/quick-actions";

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();

  // Fetch stats
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { data: revenueData } = await supabase
    .from("orders")
    .select("amount")
    .eq("status", "completed");

  const totalRevenue = revenueData?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (name),
      courses (title)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Admin <span className="text-accent">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Overview of your platform&apos;s performance and recent activity
        </p>
      </div>

      {/* Stats */}
      <AdminStats
        totalUsers={totalUsers || 0}
        totalCourses={totalCourses || 0}
        totalOrders={totalOrders || 0}
        totalRevenue={totalRevenue}
      />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminRecentActivity
            recentOrders={recentOrders || []}
            recentUsers={recentUsers || []}
          />
        </div>
        <div>
          <AdminQuickActions />
        </div>
      </div>
    </div>
  );
}
