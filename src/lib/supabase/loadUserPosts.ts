import { createClient } from "@/lib/supabase/client";

export interface ProfilePost {
  post_id: string;
  caption: string | null;
  created_at: string;
  imageUrl: string | null;
}

export async function loadUserPosts(userId: string): Promise<ProfilePost[]> {
  const supabase = createClient();

  const { data: posts, error: postError } = await supabase
    .from("post")
    .select("post_id, caption, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (postError) throw postError;
  if (!posts?.length) return [];

  const { data: images, error: imageError } = await supabase
    .from("post_image")
    .select("post_id, storage_path, display_order")
    .in(
      "post_id",
      posts.map((post) => post.post_id),
    )
    .order("display_order", { ascending: true });

  if (imageError) throw imageError;

  const firstImageByPost = new Map<string, string>();
  for (const image of images ?? []) {
    if (!firstImageByPost.has(image.post_id)) {
      firstImageByPost.set(image.post_id, image.storage_path);
    }
  }
  const signedUrlByPost = new Map<string, string>();
  for (const [postId, path] of firstImageByPost) {
    const { data, error } = await supabase.storage.from("post-images").createSignedUrl(path, 60 * 60);

    if (error) throw error;
    signedUrlByPost.set(postId, data.signedUrl);
  }
  return posts.map((post) => ({
    ...post,
    imageUrl: signedUrlByPost.get(post.post_id) ?? null,
  }));
}
