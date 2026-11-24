import { createClient } from "@/lib/supabase/client";

export interface PublicProfile { 
    user_id:string;
    handle:string | null;
    display_name:string | null;
    bio:string | null;
    profile_picture_url:string | null;
    banner_url:string | null;
}

export async function loadPublicProfile(handle: string): Promise<PublicProfile | null> {
    const { data, error } = await createClient()
    .from("public_profile")
    .select("user_id, handle, display_name, bio, profile_picture_url, banner_url")
    .eq("handle", handle)
    .maybeSingle();

if (error) throw error;
return data;
}