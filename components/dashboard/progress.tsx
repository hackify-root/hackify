"use client";

import Link from "next/link";
import { Play, CheckCircle, Clock } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

interface ProgressItem {
  id: string;
  is_completed: boolean;
  watch_time: number;
  updated_at: string;
  videos: {
    id: string;
    title: string;
    duration: number;
    chapters: {
      id: string;
      title: string;
      courses: {
        id: string;
        title: string;
        thumbnail_url: string | null;
        slug: string;
      };
    };
  };
}

interface DashboardProgressProps {
  progress: ProgressItem[];
}

export function DashboardProgress({ progress }: DashboardProgressProps) {
  const recentProgress = progress.slice(0, 5);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (recentProgress.length === 0) {
    return (
      <CyberCard className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            No activity yet. Start watching courses to track your progress!
          </p>
          <Link href="/dashboard/courses">
            <CyberButton>Browse Courses</CyberButton>
          </Link>
        </div>
      </CyberCard>
    );
  }

  return (
    <CyberCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
        <Link
          href="/dashboard/courses"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {recentProgress.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/courses/${item.videos.chapters.courses.slug}/watch/${item.videos.id}`}
            className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-muted/50 border border-border hover:border-primary/30 transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              {item.videos.chapters.courses.thumbnail_url ? (
                <img
                  src={item.videos.chapters.courses.thumbnail_url || "/placeholder.svg"}
                  alt={item.videos.chapters.courses.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              {item.is_completed && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {item.videos.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.videos.chapters.courses.title} - {item.videos.chapters.title}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDuration(item.videos.duration)}
            </div>
          </Link>
        ))}
      </div>
    </CyberCard>
  );
}
