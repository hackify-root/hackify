import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check if Supabase credentials are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Allow public routes without Supabase
    const publicPaths = ["/", "/auth/login", "/auth/register"];
    if (publicPaths.includes(request.nextUrl.pathname)) {
      return supabaseResponse;
    }
    // Redirect protected routes to home when Supabase is not configured
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard and admin routes
  if (
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/courses") ||
      request.nextUrl.pathname.startsWith("/player") ||
      request.nextUrl.pathname.startsWith("/leaderboard") ||
      request.nextUrl.pathname.startsWith("/chat")) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith("/auth/") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
