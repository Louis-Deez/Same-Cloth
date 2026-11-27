import { createClient } from "@/lib/supabase/client";

export async function searchPublicProfiles(query: string){
    const handle = query.trim().replace(/^@/, "");
    if (!handle) return [];

    const { data, error } = await createClient()
    .from("public_profile")
    .select("user_id, handle, display_name, profile_picture_url")
    .ilike("handle", `${handle}%`)
    .limit(8);

    if(error) throw error;
    return data ?? [];
}