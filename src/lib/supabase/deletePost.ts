import { createClient } from "@/lib/supabase/client";

export async function deletePost(postId: string): Promise<{ warning?: string }> {
    const supabase = createClient();

    const { data: images, error: imageError } = await supabase
    .from("post_image")
    .select("storage_path")
    .eq("post_id", postId);

    if (imageError) throw imageError;

    const { data: deletedPost, error: deleteError } = await supabase 
        .from("post")
        .delete()
        .eq("post_id", postId)
        .select("post_id")
        .maybeSingle();

    if (deleteError) throw deleteError;
    if (!deletedPost) throw new Error("Post not found, or you do not have permission to delete it.");
    
    const paths = (images ?? []).map((image) => image.storage_path);
    if (!paths.length) return {};

    const { error: storageError } = await supabase.storage.from("post-images").remove(paths);

    return storageError
    ? { warning: `The post was deleted, but its image could not be removed: ${storageError.message}` }
    : {};
}