import { createClient } from "@/lib/supabase/client";

export interface CurrentProfile {
  handle: string | null;
  displayName: string | null;
  bio: string | null;
  firstName: string | null;
  lastName: string | null;
  //LINK TO THE UPLOADED PROFILE PICTURE, NULL IF NOT UPLOADED YET - C
  profilePictureURL: string | null;
  //LINK TO THE UPLOADED BANNER, NULL IF NOT UPLOADED YET - C
  bannerURL: string | null;
}

//Loads the profile
export async function loadProfile(userId: string): Promise<CurrentProfile | null> {
  const supabase = createClient();

  //1. GETS THE PUBLIC INFO, NOW ALSO THE TWO IMAGE LINKS (DATABASE NAMES ARE LOWERCASE_WITH_UNDERSCORES) - C
  const { data: publicRow } = await supabase
    .from("public_profile")
    .select("handle, display_name, bio, profile_picture_url, banner_url")
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
    //2. TURNS THE DATABASE NAMES INTO THE CODE NAMES, NULL IF EMPTY - C
    profilePictureURL: publicRow?.profile_picture_url ?? null,
    bannerURL: publicRow?.banner_url ?? null,
  };
}
