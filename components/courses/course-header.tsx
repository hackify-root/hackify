"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Star, CheckCircle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  level: string;
  category: string | null;
  is_featured: boolean;
}

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseHeader({ course, isEnrolled }: CourseHeaderProps) {
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

  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Header content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="relative w-full md:w-80 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {course.is_featured && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            {isEnrolled && (
              <span className="px-2 py-1 bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Enrolled
              </span>
            )}
            <span
              className={`px-2 py-1 text-xs font-medium uppercase tracking-wider rounded border ${getLevelColor(
                course.level
              )}`}
            >
              {course.level}
            </span>
            {course.category && (
              <span className="px-2 py-1 bg-card border border-border text-muted-foreground text-xs rounded">
                {course.category}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {course.title}
          </h1>

          {course.description && (
            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
