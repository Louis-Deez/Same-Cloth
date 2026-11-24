import { createClient } from "@/lib/supabase/client";

export async function updatePostCaption(postId: string, caption: string): Promise<void> {
    const supabase = createClient();

    const {data, error } = await supabase
    .from("post")
    .update({ caption: caption .trim() || null })
    .eq("post_id", postId)
    .select("post_id")
    .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Post not found, or you do not have permission to edit it.");
}