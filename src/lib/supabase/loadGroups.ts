import { createClient } from "@/lib/supabase/client";
import { GroupData } from "@/models/groups/data";

interface GroupRow {
  group_id: string;
  name: string;
  description: string | null;
  community_group_criteria: { option_id: number }[] | null;
  community_group_member: { count: number }[] | null;
}

// loads every group with its interests and member count, newest first
export async function loadGroups(): Promise<{ groups: GroupData[]; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("community_group")
    .select("group_id, name, description, community_group_criteria(option_id), community_group_member(count)")
    .order("created_at", { ascending: false });
  if (error) return { groups: [], error: error.message };

  const groups = ((data ?? []) as unknown as GroupRow[]).map((row) => ({
    id: row.group_id,
    name: row.name,
    description: row.description ?? undefined,
    criteriaOptionIds: (row.community_group_criteria ?? []).map((criteria) => criteria.option_id),
    memberCount: row.community_group_member?.[0]?.count ?? 0,
  }));

  return { groups };
}
