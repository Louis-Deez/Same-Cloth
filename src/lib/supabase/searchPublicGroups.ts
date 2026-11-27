import { createClient } from "@/lib/supabase/client";

export async function searchPublicGroups(query: string) {
    const term = query.trim();
    if (!term) return [];

    const { data, error} = await createClient()
    .from("community_group")
    .select("group_id, name , description")
    .ilike("name", `%${term}%`)
    .limit(8);

if (error) throw error;
return data ?? [];

}