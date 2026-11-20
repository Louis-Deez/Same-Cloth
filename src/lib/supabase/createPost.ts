import { createClient } from "@/lib/supabase/client";
import type { PostData } from "@/models/post/data";

const POST_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const POST_IMAGE_BUCKET = "post-images";

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function removePost(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  storagePath?: string,
): Promise<string[]> {
  const cleanupErrors: string[] = [];

  if (storagePath) {
    const { error } = await supabase.storage.from(POST_IMAGE_BUCKET).remove([storagePath]);
    if (error) cleanupErrors.push(`Could not remove the uploaded image: ${error.message}`);
  }

  const { error } = await supabase.from("post").delete().eq("post_id", postId);
  if (error) cleanupErrors.push(`Could not remove the incomplete post: ${error.message}`);

  return cleanupErrors;
}

export async function createPost(
  post: PostData,
  userId: string,
): Promise<{ postId?: string; error?: string }> {
  const caption = post.postCaption.trim();
  const image = post.postImage;

  if (!caption && !image) return { error: "Add a caption or select an image." };
  if (caption.length > 2000) return { error: "Caption must be 2000 characters or fewer." };

  if (image) {
    if (!imageExtensions[image.type]) {
      return { error: "Choose a JPEG, PNG, or WebP image." };
    }
    if (image.size > POST_IMAGE_MAX_SIZE) {
      return { error: "Image must be 5 MB or smaller." };
    }
  }

  const supabase = createClient();
  const { data: postRow, error: postError } = await supabase
    .from("post")
    .insert({ user_id: userId, caption: caption || null })
    .select("post_id")
    .single();

  if (postError) return { error: postError.message };

  if (!image) return { postId: postRow.post_id };

  const storagePath = `${userId}/${postRow.post_id}/${crypto.randomUUID()}.${imageExtensions[image.type]}`;
  const { error: uploadError } = await supabase.storage
    .from(POST_IMAGE_BUCKET)
    .upload(storagePath, image, { contentType: image.type, upsert: false });

  if (uploadError) {
    const cleanupErrors = await removePost(supabase, postRow.post_id);
    return {
      error: [uploadError.message, ...cleanupErrors].join(" "),
    };
  }

  const { error: imageRowError } = await supabase.from("post_image").insert({
    post_id: postRow.post_id,
    storage_path: storagePath,
    display_order: 0,
  });

  if (imageRowError) {
    const cleanupErrors = await removePost(supabase, postRow.post_id, storagePath);
    return {
      error: [imageRowError.message, ...cleanupErrors].join(" "),
    };
  }

  return { postId: postRow.post_id };
}
