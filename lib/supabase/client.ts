import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return existing client if available (singleton pattern)
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return null if credentials are not available
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return client;
}
