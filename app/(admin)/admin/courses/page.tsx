import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Plus, BookOpen, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

export default async function AdminCoursesPage() {
  const supabase = await createServerClient();

  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      chapters (
        id,
        videos (id)
      ),
      orders (id)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Manage <span className="text-accent">Courses</span>
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your course library
          </p>
        </div>
        <Link href="/admin/courses/new">
          <CyberButton variant="danger">
            <Plus className="w-5 h-5" />
            Add Course
          </CyberButton>
        </Link>
      </div>

      {/* Courses list */}
      <CyberCard variant="danger" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/30">
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Chapters
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right p-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p>No courses yet. Create your first course!</p>
                      <Link href="/admin/courses/new">
                        <CyberButton variant="danger" size="sm">
                          <Plus className="w-4 h-4" />
                          Add Course
                        </CyberButton>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                courses?.map((course) => {
                  const totalChapters = course.chapters?.length || 0;
                  const totalVideos = course.chapters?.reduce(
                    (acc: number, ch: { videos: { id: string }[] }) => acc + (ch.videos?.length || 0),
                    0
                  ) || 0;
                  const enrollments = course.orders?.length || 0;

                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {course.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {course.level} - {course.category || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-accent">
                          {course.price === 0 ? "FREE" : `$${course.price}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground">
                          {totalChapters} chapters, {totalVideos} videos
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground">
                          {enrollments} students
                        </span>
                      </td>
                      <td className="p-4">
                        {course.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded">
                            <Eye className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted border border-border text-muted-foreground text-xs rounded">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/courses/${course.id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}
