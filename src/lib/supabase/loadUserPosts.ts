import { createClient } from "@/lib/supabase/client";

interface PostInteractionCount {
  post_id: string;
  like_count: number | string;
  comment_count: number | string;
}

function isPostInteractionCount(value: unknown): value is PostInteractionCount {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;

  return (
    typeof row.post_id === "string" &&
    (typeof row.like_count === "number" || typeof row.like_count === "string") &&
    (typeof row.comment_count === "number" || typeof row.comment_count === "string")
  );
}

export interface ProfilePost {
  post_id: string;
  caption: string | null;
  created_at: string;
  imageUrl: string | null;
  user_id: string;
  author: {
    handle: string | null;
    display_name: string | null;
    profile_picture_url: string | null;
  } | null;
  likeCount: number;
  commentCount: number;
}

export async function loadUserPosts(userId: string): Promise<ProfilePost[]> {
  const supabase = createClient();

  const { data: posts, error: postError } = await supabase
    .from("post")
    .select("post_id, user_id, caption, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (postError) throw postError;
  if (!posts?.length) return [];

  const [imagesResult, authorsResult, countsResult] = await Promise.all([
    supabase
      .from("post_image")
      .select("post_id, storage_path, display_order")
      .in("post_id", posts.map((post) => post.post_id))
      .order("display_order", { ascending: true }),
    supabase
      .from("public_profile")
      .select("user_id, handle, display_name, profile_picture_url")
      .in("user_id", [...new Set(posts.map((post) => post.user_id))]),
    supabase.rpc("get_post_interaction_counts", {
      p_post_ids: posts.map((post) => post.post_id),
    }),
  ]);

  if (imagesResult.error) throw imagesResult.error;
  if (authorsResult.error) throw authorsResult.error;
  if (countsResult.error) throw countsResult.error;
  if (!Array.isArray(countsResult.data) || !countsResult.data.every(isPostInteractionCount)) {
    throw new Error("The post interaction counts response was invalid.");
  }

  const firstImageByPost = new Map<string, string>();
  for (const image of imagesResult.data ?? []) {
    if (!firstImageByPost.has(image.post_id)) firstImageByPost.set(image.post_id, image.storage_path);
  }

  const signedUrlByPost = new Map<string, string>();
  for (const [postId, path] of firstImageByPost) {
    const { data, error } = await supabase.storage.from("post-images").createSignedUrl(path, 60 * 60);
    if (error) throw error;
    signedUrlByPost.set(postId, data.signedUrl);
  }

  const authorsByUserId = new Map((authorsResult.data ?? []).map((author) => [author.user_id, author]));
  const countsByPostId = new Map((countsResult.data ?? []).map((count) => [count.post_id, count]));

  return posts.map((post) => ({
    ...post,
    imageUrl: signedUrlByPost.get(post.post_id) ?? null,
    author: authorsByUserId.get(post.user_id) ?? null,
    likeCount: Number(countsByPostId.get(post.post_id)?.like_count ?? 0),
    commentCount: Number(countsByPostId.get(post.post_id)?.comment_count ?? 0),
  }));
}