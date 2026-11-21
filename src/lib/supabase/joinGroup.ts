import { createClient } from "@/lib/supabase/client";

// adds the logged-in user to a group as a member
export async function joinGroup(groupId: string): Promise<{ error?: string }> {
  const supabase = createClient();

  // 1) who is logged in?
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to join a group." };

  // 2) add them to the group
  const { error } = await supabase.from("community_group_member").insert({ group_id: groupId, user_id: user.id });

  // 3) already joined, or something else went wrong
  if (error) {
    if (error.code === "23505") return { error: "You're already in this group." };
    return { error: error.message };
  }

  // 4) worked
  return {};
}
