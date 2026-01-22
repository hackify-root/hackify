import { createServerClient } from "@/lib/supabase/server";
import { CourseGrid } from "@/components/courses/course-grid";
import { CourseFilters } from "@/components/courses/course-filters";

export default async function CoursesPage() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch all active courses
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      chapters (
        id,
        videos (id, duration)
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch user's enrolled courses
  const { data: enrolledCourses } = user ? await supabase
    .from("orders")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("status", "completed") : { data: [] };

  const enrolledCourseIds = enrolledCourses?.map(e => e.course_id) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Course <span className="text-primary text-glow-sm">Catalog</span>
        </h1>
        <p className="text-muted-foreground">
          Explore our library of ethical hacking and cybersecurity courses
        </p>
      </div>

      {/* Filters */}
      <CourseFilters />

      {/* Course grid */}
      <CourseGrid 
        courses={courses || []} 
        enrolledCourseIds={enrolledCourseIds} 
      />
    </div>
  );
}
