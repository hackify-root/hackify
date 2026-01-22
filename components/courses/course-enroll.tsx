"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Trophy, Lock, Play, CheckCircle } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";
import { createClient } from "@/lib/supabase/client";

interface Video {
  id: string;
  duration: number;
}

interface Chapter {
  id: string;
  videos: Video[];
}

interface Course {
  id: string;
  title: string;
  price: number;
  xp_reward: number;
}

interface CourseEnrollProps {
  course: Course;
  isEnrolled: boolean;
  chapters: Chapter[];
}

export function CourseEnroll({ course, isEnrolled, chapters }: CourseEnrollProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const totalVideos = chapters.reduce((acc, ch) => acc + ch.videos.length, 0);
  const totalDuration = chapters.reduce(
    (acc, ch) => acc + ch.videos.reduce((v, video) => v + video.duration, 0),
    0
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // For free courses, create the order directly
      if (course.price === 0) {
        const { error } = await supabase.from("orders").insert({
          user_id: user.id,
          course_id: course.id,
          amount: 0,
          status: "completed",
        });

        if (error) throw error;

        // Award XP for enrollment
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp, level")
          .eq("id", user.id)
          .single();

        if (profile) {
          const newXP = profile.xp + (course.xp_reward || 100);
          const newLevel = Math.floor(newXP / 1000) + 1;

          await supabase
            .from("profiles")
            .update({ xp: newXP, level: newLevel })
            .eq("id", user.id);
        }

        router.refresh();
      } else {
        // For paid courses, redirect to checkout (would integrate with Stripe)
        router.push(`/dashboard/courses/${course.id}/checkout`);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const firstVideoId = chapters[0]?.videos[0]?.id;

  return (
    <CyberCard variant="highlight" glowing className="p-6 sticky top-20">
      {/* Price */}
      <div className="text-center mb-6">
        {isEnrolled ? (
          <div className="flex items-center justify-center gap-2 text-primary">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xl font-bold">Enrolled</span>
          </div>
        ) : course.price === 0 ? (
          <div className="text-3xl font-bold text-primary">FREE</div>
        ) : (
          <div className="text-3xl font-bold text-foreground">
            ${course.price}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">{totalVideos} lessons</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {formatDuration(totalDuration)} total
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-primary">
            +{course.xp_reward || 100} XP on completion
          </span>
        </div>
      </div>

      {/* CTA */}
      {isEnrolled ? (
        <CyberButton
          className="w-full"
          size="lg"
          onClick={() =>
            firstVideoId &&
            router.push(
              `/dashboard/courses/${course.id}/watch/${firstVideoId}`
            )
          }
        >
          <Play className="w-5 h-5" />
          Continue Learning
        </CyberButton>
      ) : (
        <CyberButton
          className="w-full"
          size="lg"
          onClick={handleEnroll}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </span>
          ) : course.price === 0 ? (
            <>
              <Lock className="w-5 h-5" />
              Enroll for Free
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Purchase Course
            </>
          )}
        </CyberButton>
      )}

      {/* Features */}
      <div className="mt-6 pt-6 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          Includes:
        </p>
        {[
          "Lifetime access",
          "Certificate of completion",
          "Downloadable resources",
          "Mobile access",
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </CyberCard>
  );
}
