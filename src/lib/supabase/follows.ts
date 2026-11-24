import { createClient } from "@/lib/supabase/client";

export interface FollowStats {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export async function loadFollowStats(
  profileUserId: string,
  currentUserId: string,
): Promise<FollowStats> {
  const supabase = createClient();

  const [followers, following, relationship] = await Promise.all([
    supabase
      .from("user_follow")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", profileUserId),
    supabase
      .from("user_follow")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", profileUserId),
    supabase
      .from("user_follow")
      .select("follower_id")
      .eq("follower_id", currentUserId)
      .eq("following_id", profileUserId)
      .maybeSingle(),
  ]);

  if (followers.error) throw followers.error;
  if (following.error) throw following.error;
  if (relationship.error) throw relationship.error;

  return {
    followerCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
    isFollowing: relationship.data !== null,
  };
}

export async function setFollowRelationship(
  profileUserId: string,
  currentUserId: string,
  shouldFollow: boolean,
): Promise<void> {
  const supabase = createClient();

  const result = shouldFollow
    ? await supabase
        .from("user_follow")
        .insert({ follower_id: currentUserId, following_id: profileUserId })
    : await supabase
        .from("user_follow")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profileUserId);

  if (result.error) throw result.error;
}