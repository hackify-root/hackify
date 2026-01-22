import { createServerClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/dashboard/stats";
import { DashboardProgress } from "@/components/dashboard/progress";
import { DashboardAchievements } from "@/components/dashboard/achievements";
import { DashboardRecentCourses } from "@/components/dashboard/recent-courses";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user progress
  const { data: progress } = await supabase
    .from("progress")
    .select(`
      *,
      videos (
        id,
        title,
        duration,
        chapters (
          id,
          title,
          courses (
            id,
            title,
            thumbnail_url,
            slug
          )
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch recent orders/enrollments
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      courses (
        id,
        title,
        thumbnail_url,
        slug,
        chapters (
          id,
          videos (id)
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(4);

  // Calculate stats
  const totalCourses = orders?.length || 0;
  const completedVideos = progress?.filter(p => p.is_completed)?.length || 0;
  const totalWatchTime = progress?.reduce((acc, p) => acc + (p.watch_time || 0), 0) || 0;
  const streak = 7; // This would be calculated from activity data

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary text-glow-sm">{profile?.name || "Hacker"}</span>
        </h1>
        <p className="text-muted-foreground">
          Continue your hacking journey. You&apos;re doing great!
        </p>
      </div>

      {/* Stats grid */}
      <DashboardStats
        level={profile?.level || 1}
        xp={profile?.xp || 0}
        totalCourses={totalCourses}
        completedVideos={completedVideos}
        totalWatchTime={totalWatchTime}
        streak={streak}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress section */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardProgress progress={progress || []} />
          <DashboardRecentCourses orders={orders || []} />
        </div>

        {/* Achievements sidebar */}
        <div className="space-y-6">
          <DashboardAchievements profile={profile} />
        </div>
      </div>
    </div>
  );
}
