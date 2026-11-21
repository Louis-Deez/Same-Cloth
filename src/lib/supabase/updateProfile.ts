import { createClient } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/uploadProfileImage";
import { ProfileDataPatch } from "@/models/settings/profileData";

export async function updateProfile(userId: string, patch: ProfileDataPatch): Promise<{ error?: string }> {
  if (patch.profileImage) {
    const { error } = await uploadProfileImage(userId, "avatar", patch.profileImage);
    if (error) return { error };
  }

  if (patch.bannerImage) {
    const { error } = await uploadProfileImage(userId, "banner", patch.bannerImage);
    if (error) return { error };
  }

  const changes: { display_name?: string; bio?: string } = {};
  if (patch.displayName !== undefined) changes.display_name = patch.displayName.trim();
  if (patch.bio !== undefined) changes.bio = patch.bio.trim();

  if (Object.keys(changes).length > 0) {
    const supabase = createClient();
    const { error } = await supabase.from("public_profile").update(changes).eq("user_id", userId);
    if (error) return { error: error.message };
  }

  return {};
}
