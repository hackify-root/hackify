import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { VideoPlayer } from "@/components/courses/video-player";
import { VideoSidebar } from "@/components/courses/video-sidebar";

interface VideoPageProps {
  params: Promise<{ slug: string; videoId: string }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug, videoId } = await params;
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the video with its chapter and course info
  const { data: video } = await supabase
    .from("videos")
    .select(`
      *,
      chapters (
        id,
        title,
        order_index,
        courses (
          id,
          title,
          slug
        )
      )
    `)
    .eq("id", videoId)
    .single();

  if (!video || video.chapters.courses.slug !== slug) {
    notFound();
  }

  // Check if user is enrolled or if video is preview
  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", video.chapters.courses.id)
    .eq("status", "completed")
    .single();

  const isEnrolled = !!order;
  const canAccess = isEnrolled || video.is_preview;

  if (!canAccess) {
    redirect(`/dashboard/courses/${slug}`);
  }

  // Fetch all chapters and videos for the sidebar
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      chapters (
        id,
        title,
        order_index,
        videos (
          id,
          title,
          duration,
          order_index,
          is_preview
        )
      )
    `)
    .eq("id", video.chapters.courses.id)
    .single();

  // Sort chapters and videos
  const sortedChapters = course?.chapters
    .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
    .map((chapter: { id: string; title: string; order_index: number; videos: { id: string; title: string; duration: number; order_index: number; is_preview: boolean }[] }) => ({
      ...chapter,
      videos: chapter.videos.sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index),
    })) || [];

  // Fetch user's progress
  const videoIds = sortedChapters.flatMap((ch: { videos: { id: string }[] }) => ch.videos.map((v: { id: string }) => v.id));
  const { data: progress } = await supabase
    .from("progress")
    .select("video_id, is_completed, watch_time")
    .eq("user_id", user.id)
    .in("video_id", videoIds);

  // Get current video progress
  const currentProgress = progress?.find((p) => p.video_id === videoId);

  // Find next video
  let nextVideo = null;
  let foundCurrent = false;
  for (const chapter of sortedChapters) {
    for (const v of chapter.videos) {
      if (foundCurrent) {
        nextVideo = { ...v, chapterTitle: chapter.title };
        break;
      }
      if (v.id === videoId) {
        foundCurrent = true;
      }
    }
    if (nextVideo) break;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 -m-4 lg:-m-6 min-h-[calc(100vh-4rem)]">
      {/* Main video area */}
      <div className="flex-1 flex flex-col">
        <VideoPlayer
          video={video}
          courseSlug={slug}
          initialProgress={currentProgress?.watch_time || 0}
          isCompleted={currentProgress?.is_completed || false}
          nextVideo={nextVideo}
          isEnrolled={isEnrolled}
        />
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 lg:border-l lg:border-border bg-card/50">
        <VideoSidebar
          chapters={sortedChapters}
          currentVideoId={videoId}
          courseSlug={slug}
          userProgress={progress || []}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
