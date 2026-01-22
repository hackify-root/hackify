"use client";

import Link from "next/link";
import { Play, Clock, BookOpen, Star, CheckCircle, Lock } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  level: string;
  category: string | null;
  is_featured: boolean;
  chapters: {
    id: string;
    videos: { id: string; duration: number }[];
  }[];
}

interface CourseGridProps {
  courses: Course[];
  enrolledCourseIds: string[];
}

export function CourseGrid({ courses, enrolledCourseIds }: CourseGridProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "text-primary bg-primary/10 border-primary/30";
      case "intermediate":
        return "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30";
      case "advanced":
        return "text-accent bg-accent/10 border-accent/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No courses found
        </h3>
        <p className="text-muted-foreground">
          Check back later for new courses or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        const totalVideos = course.chapters.reduce(
          (acc, chapter) => acc + chapter.videos.length,
          0
        );
        const totalDuration = course.chapters.reduce(
          (acc, chapter) =>
            acc + chapter.videos.reduce((v, video) => v + video.duration, 0),
          0
        );

        return (
          <CyberCard
            key={course.id}
            variant={course.is_featured ? "highlight" : "default"}
            glowing={course.is_featured}
            className="overflow-hidden group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                  <BookOpen className="w-16 h-16 text-primary/50" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Featured badge */}
              {course.is_featured && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}

              {/* Enrolled badge */}
              {isEnrolled && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1 backdrop-blur-sm">
                  <CheckCircle className="w-3 h-3" />
                  Enrolled
                </div>
              )}

              {/* Level badge */}
              <div
                className={`absolute bottom-2 left-2 px-2 py-1 text-xs font-medium uppercase tracking-wider rounded border ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {totalVideos} videos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(totalDuration)}
                </span>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                {isEnrolled ? (
                  <span className="text-sm text-primary font-medium">
                    Continue Learning
                  </span>
                ) : course.price === 0 ? (
                  <span className="text-sm text-primary font-bold">FREE</span>
                ) : (
                  <span className="text-lg font-bold text-foreground">
                    ${course.price}
                  </span>
                )}

                <Link href={`/dashboard/courses/${course.slug}`}>
                  <CyberButton size="sm">
                    {isEnrolled ? (
                      <>
                        <Play className="w-4 h-4" />
                        Watch
                      </>
                    ) : course.price === 0 ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Enroll Free
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Get Access
                      </>
                    )}
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        );
      })}
    </div>
  );
}
