
import { createBrowserClient } from "@supabase/ssr";

// Browser client for normal user authentication.
// Uses the public Supabase key, never the service-role key.
export function createSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check configuration before creating the client.
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Public Supabase configuration is missing");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
