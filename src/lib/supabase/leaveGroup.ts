import { createClient } from "@/lib/supabase/client";

// removes the logged-in user from a group
// if they are the host, the next member becomes host; if they are the last one, the group is deleted
export async function leaveGroup(groupId: string): Promise<{ error?: string }> {
  const supabase = createClient();

  // 1) the database function gets the user from the login, so no getUser here
  const { error } = await supabase.rpc("leave_community_group", { p_group_id: groupId });

  // 2) handle errors
  if (error) return { error: error.message };

  // 3) nothing went wrong
  return {};
}
