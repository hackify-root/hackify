import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CourseHeader } from "@/components/courses/course-header";
import { CourseCurriculum } from "@/components/courses/course-curriculum";
import { CourseEnroll } from "@/components/courses/course-enroll";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch course with chapters and videos
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
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
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!course) {
    notFound();
  }

  // Sort chapters and videos by order_index
  const sortedChapters = course.chapters
    .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
    .map((chapter: { id: string; title: string; order_index: number; videos: { id: string; title: string; duration: number; order_index: number; is_preview: boolean }[] }) => ({
      ...chapter,
      videos: chapter.videos.sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index),
    }));

  // Check if user is enrolled
  let isEnrolled = false;
  let userProgress: { video_id: string; completed: boolean }[] = [];

  if (user) {
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "completed")
      .single();

    isEnrolled = !!order;

    if (isEnrolled) {
      // Fetch user's progress for this course
      const videoIds = sortedChapters.flatMap((ch: { videos: { id: string }[] }) => ch.videos.map((v: { id: string }) => v.id));
      const { data: progress } = await supabase
        .from("progress")
        .select("video_id, completed")
        .eq("user_id", user.id)
        .in("video_id", videoIds);
      
      userProgress = progress || [];
    }
  }

  return (
    <div className="space-y-6">
      <CourseHeader course={course} isEnrolled={isEnrolled} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curriculum */}
        <div className="lg:col-span-2">
          <CourseCurriculum
            chapters={sortedChapters}
            isEnrolled={isEnrolled}
            userProgress={userProgress}
            courseSlug={slug}
          />
        </div>

        {/* Sidebar */}
        <div>
          <CourseEnroll
            course={course}
            isEnrolled={isEnrolled}
            chapters={sortedChapters}
          />
        </div>
      </div>
    </div>
  );
}
