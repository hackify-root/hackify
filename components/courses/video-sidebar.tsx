"use client";

import Link from "next/link";
import { Play, CheckCircle, Lock, Clock } from "lucide-react";

interface Video {
  id: string;
  title: string;
  duration: number;
  is_preview: boolean;
}

interface Chapter {
  id: string;
  title: string;
  videos: Video[];
}

interface VideoSidebarProps {
  chapters: Chapter[];
  currentVideoId: string;
  courseSlug: string;
  userProgress: { video_id: string; is_completed: boolean }[];
  isEnrolled: boolean;
}

export function VideoSidebar({
  chapters,
  currentVideoId,
  courseSlug,
  userProgress,
  isEnrolled,
}: VideoSidebarProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const isVideoCompleted = (videoId: string) => {
    return userProgress.find((p) => p.video_id === videoId)?.is_completed || false;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Course Content</h2>
      </div>

      <div className="divide-y divide-border">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id}>
            {/* Chapter header */}
            <div className="px-4 py-3 bg-card/80">
              <p className="text-xs text-muted-foreground mb-1">
                Chapter {chapterIndex + 1}
              </p>
              <p className="text-sm font-medium text-foreground">
                {chapter.title}
              </p>
            </div>

            {/* Videos */}
            <div className="divide-y divide-border/50">
              {chapter.videos.map((video, videoIndex) => {
                const isCurrent = video.id === currentVideoId;
                const isCompleted = isVideoCompleted(video.id);
                const canAccess = isEnrolled || video.is_preview;

                return (
                  <Link
                    key={video.id}
                    href={
                      canAccess
                        ? `/dashboard/courses/${courseSlug}/watch/${video.id}`
                        : "#"
                    }
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isCurrent
                        ? "bg-primary/10 border-l-2 border-primary"
                        : canAccess
                        ? "hover:bg-muted/50"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => !canAccess && e.preventDefault()}
                  >
                    {/* Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-primary/20 text-primary"
                          : canAccess
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : canAccess ? (
                        <Play className="w-3 h-3 ml-0.5" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isCurrent
                            ? "text-primary font-medium"
                            : isCompleted
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {chapterIndex + 1}.{videoIndex + 1} {video.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
