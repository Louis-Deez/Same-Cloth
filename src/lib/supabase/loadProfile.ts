import { createClient } from "@/lib/supabase/client";

export interface CurrentProfile {
  handle: string | null;
  displayName: string | null;
  bio: string | null;
  firstName: string | null;
  lastName: string | null;
}

//Loads the profile 
export async function loadProfile(userId: string): Promise<CurrentProfile | null> {
  const supabase = createClient();

  const { data: publicRow } = await supabase
    .from("public_profile")
    .select("handle, display_name, bio")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: privateRow } = await supabase
    .from("user_profile")
    .select("first_name, last_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!publicRow && !privateRow) return null;

  return {
    handle: publicRow?.handle ?? null,
    displayName: publicRow?.display_name ?? null,
    bio: publicRow?.bio ?? null,
    firstName: privateRow?.first_name ?? null,
    lastName: privateRow?.last_name ?? null,
  };
}
