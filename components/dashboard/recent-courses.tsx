"use client";

import Link from "next/link";
import { Play, BookOpen, ChevronRight } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

interface Order {
  id: string;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    slug: string;
    chapters: {
      id: string;
      videos: { id: string }[];
    }[];
  };
}

interface DashboardRecentCoursesProps {
  orders: Order[];
}

export function DashboardRecentCourses({ orders }: DashboardRecentCoursesProps) {
  if (orders.length === 0) {
    return (
      <CyberCard className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          My Courses
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Link href="/dashboard/courses">
            <CyberButton>Explore Courses</CyberButton>
          </Link>
        </div>
      </CyberCard>
    );
  }

  return (
    <CyberCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
        <Link
          href="/dashboard/courses"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {orders.map((order) => {
          const totalVideos = order.courses.chapters.reduce(
            (acc, chapter) => acc + chapter.videos.length,
            0
          );

          return (
            <Link
              key={order.id}
              href={`/dashboard/courses/${order.courses.slug}`}
              className="group"
            >
              <div className="rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-all">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {order.courses.thumbnail_url ? (
                    <img
                      src={order.courses.thumbnail_url || "/placeholder.svg"}
                      alt={order.courses.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {totalVideos} videos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {order.courses.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                    <span>Continue Learning</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </CyberCard>
  );
}
