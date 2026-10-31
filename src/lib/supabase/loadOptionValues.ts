import { createClient } from "@/lib/supabase/client";

// loads every answer option as option_id -> option_value, used to turn a group's criteriaOptionIds into hashtags
export async function loadOptionValues(): Promise<{ optionValues: Map<number, string>; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.from("answer_option").select("option_id, option_value");
  if (error) return { optionValues: new Map(), error: error.message };

  return {
    optionValues: new Map((data ?? []).map((row) => [row.option_id as number, row.option_value as string])),
  };
}
