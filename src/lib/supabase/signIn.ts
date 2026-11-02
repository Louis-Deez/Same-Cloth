import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * logs an existing user in with email + password
 *
 * logged in user is kept: Supabase saves the session in the browser
 */
export async function signIn(email: string, password: string): Promise<{ error?: string; user?: User }> {
  const supabase = createClient();

  // check the email and password. If they are right, Supabase starts a session
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { error: error.message };

  if (!data.user || !data.session) {
    return { error: "Could not start your session. Please try again." };
  }

  // nothing else to save here, the session is stored, and loads the profile for this user
  return { user: data.user };
}
