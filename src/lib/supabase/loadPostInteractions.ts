import { createClient } from "@/lib/supabase/client";

export interface PostComment { 
    comment_id: string;
    body:string;
    created_at:string;
    user_id: string;
    handle: string | null;
    display_name: string | null;
    profile_picture_url: string | null;
}

export interface PostInteractions{
    likeCount: number;
    commentCount: number;
    likedByCurrentUser: boolean;
    comments: PostComment[];
}

export async function loadPostInteractions(postId: string, userId: string): Promise<PostInteractions>{
    const supabase = createClient();

    const [likes, ownLike, comments, commentCount] = await Promise.all([
        supabase.from("post_like").select("post_id", { count: "exact", head: true }).eq("post_id", postId),
        supabase.from("post_like").select("post_id").eq("post_id", postId).eq("user_id", userId).maybeSingle(),
        supabase
            .from("post_comment")
            .select("comment_id, body, created_at, user_id")
            .eq("post_id", postId)
            .order("created_at", { ascending: false })
            .limit(100),
        supabase.from("post_comment").select("comment_id", { count: "exact", head: true }).eq("post_id", postId),
    ]);

    if (likes.error) throw likes.error;
    if (ownLike.error) throw ownLike.error;
    if (comments.error) throw comments.error;
    if (commentCount.error) throw commentCount.error;

    const rows = comments.data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const profiles = userIds.length
        ? await supabase
            .from("public_profile")
            .select("user_id, handle, display_name, profile_picture_url")
            .in("user_id", userIds)
        : { data: [], error: null };

    if (profiles.error) throw profiles.error;

    const byUserId = new Map((profiles.data ?? []).map((profile) => [profile.user_id, profile]));

    return { 
        likeCount: likes.count ?? 0,
        commentCount: commentCount.count ?? 0,
        likedByCurrentUser: ownLike.data !== null,
        comments: [...rows].reverse().map((row) => ({
            ...row,
            handle: byUserId.get(row.user_id)?.handle ?? null,
            display_name: byUserId.get(row.user_id)?.display_name ?? null,
            profile_picture_url: byUserId.get(row.user_id)?.profile_picture_url ?? null,
        })),
    };
}