import { createClient } from "@/lib/supabase/client";

// loads the option ids the user picked at signup
export async function loadSelectedOptionIds(userId: string): Promise<{ optionIds: number[]; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.from("user_selected_option").select("option_id").eq("user_id", userId);
  if (error) return { optionIds: [], error: error.message };

  return { optionIds: (data ?? []).map((row) => row.option_id as number) };
}
