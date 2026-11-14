import { createClient } from "@/lib/supabase/client";
import { SelectionData } from "@/models/form/selectionData";

// loads every answer option as a choice for the create group form, the value is the option_id as text
export async function loadGroupOptions(): Promise<{ options: SelectionData[]; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("answer_option")
    .select("option_id, option_text")
    .order("option_id", { ascending: true });
  if (error) return { options: [], error: error.message };

  return {
    options: (data ?? []).map((row) => ({ label: row.option_text as string, value: String(row.option_id) })),
  };
}
