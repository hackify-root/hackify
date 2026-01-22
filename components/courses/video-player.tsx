"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  CheckCircle,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { CyberButton } from "@/components/cyber-button";
import { createClient } from "@/lib/supabase/client";

interface Video {
  id: string;
  title: string;
  video_url: string | null;
  duration: number;
  xp_reward: number;
  chapters: {
    id: string;
    title: string;
    courses: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

interface NextVideo {
  id: string;
  title: string;
  chapterTitle: string;
}

interface VideoPlayerProps {
  video: Video;
  courseSlug: string;
  initialProgress: number;
  isCompleted: boolean;
  nextVideo: NextVideo | null;
  isEnrolled: boolean;
}

export function VideoPlayer({
  video,
  courseSlug,
  initialProgress,
  isCompleted: initialCompleted,
  nextVideo,
  isEnrolled,
}: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const [duration, setDuration] = useState(video.duration);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const supabase = createClient();

  // Save progress periodically
  useEffect(() => {
    if (!isEnrolled) return;

    const saveProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("progress").upsert({
        user_id: user.id,
        video_id: video.id,
        watch_time: Math.floor(currentTime),
        completed: isCompleted,
      }, {
        onConflict: "user_id,video_id",
      });
    };

    const interval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(interval);
  }, [currentTime, isCompleted, video.id, supabase, isEnrolled]);

  // Mark as completed when 90% watched
  useEffect(() => {
    if (!isEnrolled || isCompleted) return;
    
    if (duration > 0 && currentTime / duration >= 0.9) {
      markComplete();
    }
  }, [currentTime, duration, isCompleted, isEnrolled]);

  const markComplete = async () => {
    if (isCompleted || !isEnrolled) return;
    
    setIsCompleted(true);
    setShowXPAnimation(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update progress
    await supabase.from("progress").upsert({
      user_id: user.id,
      video_id: video.id,
      watch_time: Math.floor(currentTime),
      completed: true,
    }, {
      onConflict: "user_id,video_id",
    });

    // Award XP
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", user.id)
      .single();

    if (profile) {
      const newXP = profile.xp + (video.xp_reward || 50);
      const newLevel = Math.floor(newXP / 1000) + 1;

      await supabase
        .from("profiles")
        .update({ xp: newXP, level: newLevel })
        .eq("id", user.id);
    }

    setTimeout(() => setShowXPAnimation(false), 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Placeholder video for demo
  const placeholderUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <Link
          href={`/dashboard/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {video.chapters.courses.title}
        </Link>
        <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {video.title}
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-primary" />
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {video.chapters.title}
        </p>
      </div>

      {/* Video container */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={video.video_url || placeholderUrl}
          className="w-full h-full"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          crossOrigin="anonymous"
        />

        {/* XP Animation */}
        {showXPAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-6 animate-bounce">
              <div className="flex items-center gap-3 text-primary">
                <Zap className="w-8 h-8" />
                <span className="text-2xl font-bold">
                  +{video.xp_reward || 50} XP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          {/* Progress bar */}
          <div className="px-4 pb-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #00ff00 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
              }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <span className="text-sm text-white/80">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {nextVideo && (
                <Link
                  href={`/dashboard/courses/${courseSlug}/watch/${nextVideo.id}`}
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <SkipForward className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next video prompt */}
      {isCompleted && nextVideo && (
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Up Next</p>
              <p className="font-medium text-foreground">{nextVideo.title}</p>
            </div>
            <Link href={`/dashboard/courses/${courseSlug}/watch/${nextVideo.id}`}>
              <CyberButton size="sm">
                <SkipForward className="w-4 h-4" />
                Play Next
              </CyberButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
