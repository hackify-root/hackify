"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Play,
  Lock,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

interface Video {
  id: string;
  title: string;
  duration: number;
  order_index: number;
  is_preview: boolean;
}

interface Chapter {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

interface CourseCurriculumProps {
  chapters: Chapter[];
  isEnrolled: boolean;
  userProgress: { video_id: string; is_completed: boolean }[];
  courseSlug: string;
}

export function CourseCurriculum({
  chapters,
  isEnrolled,
  userProgress,
  courseSlug,
}: CourseCurriculumProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    chapters.length > 0 ? [chapters[0].id] : []
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const isVideoCompleted = (videoId: string) => {
    return userProgress.find((p) => p.video_id === videoId)?.is_completed || false;
  };

  const getChapterProgress = (chapter: Chapter) => {
    if (!isEnrolled) return 0;
    const completedVideos = chapter.videos.filter((v) =>
      isVideoCompleted(v.id)
    ).length;
    return (completedVideos / chapter.videos.length) * 100;
  };

  return (
    <CyberCard className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Course Curriculum
      </h2>

      <div className="space-y-3">
        {chapters.map((chapter, chapterIndex) => {
          const isExpanded = expandedChapters.includes(chapter.id);
          const chapterProgress = getChapterProgress(chapter);
          const totalDuration = chapter.videos.reduce(
            (acc, v) => acc + v.duration,
            0
          );

          return (
            <div
              key={chapter.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-3 p-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Chapter {chapterIndex + 1}
                    </span>
                    {isEnrolled && chapterProgress === 100 && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <h3 className="font-medium text-foreground">
                    {chapter.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{chapter.videos.length} lessons</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </button>

              {/* Progress bar */}
              {isEnrolled && (
                <div className="h-1 bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${chapterProgress}%` }}
                  />
                </div>
              )}

              {/* Videos list */}
              {isExpanded && (
                <div className="border-t border-border">
                  {chapter.videos.map((video, videoIndex) => {
                    const isCompleted = isVideoCompleted(video.id);
                    const canAccess = isEnrolled || video.is_preview;

                    return (
                      <div
                        key={video.id}
                        className={`flex items-center gap-3 p-3 border-b border-border last:border-b-0 ${
                          canAccess
                            ? "hover:bg-muted/30 transition-colors"
                            : "opacity-60"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? "bg-primary/20 text-primary"
                              : canAccess
                              ? "bg-muted text-muted-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : canAccess ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Content */}
                        {canAccess ? (
                          <Link
                            href={`/dashboard/courses/${courseSlug}/watch/${video.id}`}
                            className="flex-1 min-w-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {chapterIndex + 1}.{videoIndex + 1}
                              </span>
                              <span
                                className={`text-sm ${
                                  isCompleted
                                    ? "text-muted-foreground"
                                    : "text-foreground"
                                } truncate hover:text-primary transition-colors`}
                              >
                                {video.title}
                              </span>
                              {video.is_preview && !isEnrolled && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs rounded">
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </span>
                              )}
                            </div>
                          </Link>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {chapterIndex + 1}.{videoIndex + 1}
                              </span>
                              <span className="text-sm text-muted-foreground truncate">
                                {video.title}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Duration */}
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CyberCard>
  );
}
