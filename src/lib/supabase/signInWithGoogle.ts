import { createClient } from "@/lib/supabase/client";

/**
 * logs a user in with their Google account
 *
 * sends the user to Google's login page, then Google sends them back to /home logged in
 */
export async function signInWithGoogle(): Promise<{ error?: string }> {
  const supabase = createClient();

  // opens Google's login page. After they approve, Supabase starts a session
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/home` },
  });
  if (error) return { error: error.message };

  return {};
}
