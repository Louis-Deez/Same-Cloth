import { createClient } from "@/lib/supabase/client";

export interface GroupMember {
  userId: string;
  role: "owner" | "member";
  joinedAt: string;
  handle: string | null;
  displayName: string | null;
  profilePictureUrl: string | null;
}

interface MemberRow {
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  public_profile: { handle: string | null; display_name: string | null; profile_picture_url: string | null } | null;
}

// loads everyone in a group with their profile info, host first, then by join date
export async function loadGroupMembers(groupId: string): Promise<{ members: GroupMember[]; error?: string }> {
  const supabase = createClient();

  // 1) member rows plus each member's public profile
  const { data, error } = await supabase
    .from("community_group_member")
    .select("user_id, role, joined_at, public_profile(handle, display_name, profile_picture_url)")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });
  if (error) return { members: [], error: error.message };

  // 2) reshape into the app's format
  const members = ((data ?? []) as unknown as MemberRow[]).map((row) => ({
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
    handle: row.public_profile?.handle ?? null,
    displayName: row.public_profile?.display_name ?? null,
    profilePictureUrl: row.public_profile?.profile_picture_url ?? null,
  }));

  // 3) host goes to the top of the list
  members.sort((a, b) => (a.role === "owner" ? -1 : b.role === "owner" ? 1 : 0));

  return { members };
}
