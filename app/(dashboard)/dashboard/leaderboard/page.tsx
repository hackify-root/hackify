import { createServerClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { LeaderboardPodium } from "@/components/leaderboard/leaderboard-podium";
import { LeaderboardStats } from "@/components/leaderboard/leaderboard-stats";

export default async function LeaderboardPage() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch top 100 users by XP
  const { data: leaderboard } = await supabase
    .from("profiles")
    .select("id, name, xp, level, avatar_url")
    .order("xp", { ascending: false })
    .limit(100);

  // Get current user's rank if logged in
  let userRank = null;
  let userProfile = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, xp, level, avatar_url")
      .eq("id", user.id)
      .single();

    userProfile = profile;

    // Calculate rank
    if (profile) {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("xp", profile.xp);

      userRank = (count || 0) + 1;
    }
  }

  const top3 = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Global <span className="text-primary text-glow-sm">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground">
          Top hackers ranked by XP. Climb the ranks and prove your skills!
        </p>
      </div>

      {/* User's current rank (if logged in) */}
      {userProfile && userRank && (
        <LeaderboardStats userProfile={userProfile} userRank={userRank} />
      )}

      {/* Top 3 podium */}
      <LeaderboardPodium top3={top3} currentUserId={user?.id} />

      {/* Leaderboard table */}
      <LeaderboardTable 
        users={rest} 
        startRank={4} 
        currentUserId={user?.id} 
      />
    </div>
  );
}
