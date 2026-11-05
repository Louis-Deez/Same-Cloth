import { createClient } from "@/lib/supabase/client";

export type ImageKind = "avatar" | "banner";

export async function uploadProfileImage(userId: string, kind: ImageKind, file: File) {
  //1. CHECKS IF THE PICTURE IS JPEG/PNG/WEBP && 5MB - C
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) return { url: null, error: "Use a JPG, PNG, or WebP image." };
  if (file.size > 5 * 1024 * 1024) return { url: null, error: "Image must be 5 MB or smaller." };

  const supabase = createClient();

  //2. PICKS THE BUCKET (AVATARS OR BANNERS) AND THE FILE'S ADDRESS ({USER ID}/AVATAR) - C
  const bucket = kind === "avatar" ? "avatars" : "banners";
  const path = `${userId}/${kind}`;

  //3. UPLOADS THE FILE TO SUPABASE, REPLACES THE OLD ONE IF IT EXISTS - C
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });

  if (error) return { url: null, error: error.message };

  //4. GETS THE WEB LINK OF THE FILE, ADDS THE TIME SO THE BROWSER SHOWS THE NEW IMAGE - C
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  const url = `${publicUrl}?v=${Date.now()}`;

  //5. SAVES THE LINK IN MY ROW OF public_profile (profile_picture_url OR banner_url) - C
  const column = kind === "avatar" ? "profile_picture_url" : "banner_url";
  const { error: dbError } = await supabase
    .from("public_profile")
    .update({ [column]: url })
    .eq("user_id", userId);

  if (dbError) return { url: null, error: dbError.message };

  //6. SENDS THE LINK BACK SO THE PAGE CAN SHOW IT - C
  return { url, error: null };
}
