import { createClient } from "@/lib/supabase/client";
import { GROUP_DESCRIPTION_MAX, GROUP_NAME_MAX, GROUP_NAME_MIN } from "@/models/groups/limits";

export interface NewGroup {
  name: string;
  description: string;
  optionIds: number[];
}

// creates a group through the database function, which also saves the interests and makes the user the owner
export async function createGroup(group: NewGroup): Promise<{ groupId?: string; error?: string }> {
  const name = group.name.trim();
  const description = group.description.trim();

  // same checks as the database, so the user gets a clear message before any request is sent
  if (name.length < GROUP_NAME_MIN || name.length > GROUP_NAME_MAX) {
    return { error: `Group name must be between ${GROUP_NAME_MIN} and ${GROUP_NAME_MAX} characters.` };
  }
  if (description.length > GROUP_DESCRIPTION_MAX) {
    return { error: `Description must be ${GROUP_DESCRIPTION_MAX} characters or fewer.` };
  }
  if (group.optionIds.length === 0) return { error: "Pick at least one interest for the group." };

  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_community_group", {
    group_name: name,
    group_description: description,
    option_ids: group.optionIds,
  });

  if (error) {
    // unique violation means the name is taken
    if (error.code === "23505") return { error: "A group with that name already exists." };
    return { error: error.message };
  }

  return { groupId: data as string };
}
