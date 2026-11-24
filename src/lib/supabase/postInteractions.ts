import { createClient } from "@/lib/supabase/client";

export async function setPostLiked(postId: string, userId: string, liked: boolean): Promise<void> {
  const supabase = createClient();

  const result = liked
    ? await supabase.from("post_like").insert({ post_id: postId, user_id: userId })
    : await supabase.from("post_like").delete().eq("post_id", postId).eq("user_id", userId);

  if (result.error) throw result.error;
}

export async function addPostComment(postId: string, userId: string, body: string): Promise<void> {
  const trimmedBody = body.trim();

  if (!trimmedBody) throw new Error("Write a comment before posting.");
  if (trimmedBody.length > 2000) throw new Error("Comments must be 2000 characters or fewer.");

  const { error } = await createClient()
    .from("post_comment")
    .insert({ post_id: postId, user_id: userId, body: trimmedBody });

  if (error) throw error;
}