import React from "react"
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} profile={profile} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AdminHeader user={user} profile={profile} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
