import { createClient } from "@/lib/supabase/client";
import { LoginPayload } from "@/models/login/payload";

/**
 * Creates the account, then saves the Q2-Q7 checkbox picks under the new user's ID.
 * question_id numbers come from supabase/02_answers.sql.
 */
const QUESTION_IDS = {
  interests: 2,
  clothingAesthetics: 3,
  clothingNeeds: 4,
  colorPreference: 5,
  fashionEra: 6,
  subculture: 7,
} as const;

type QuestionField = keyof typeof QUESTION_IDS;

interface OptionRow {
  option_id: number;
  question_id: number;
  option_value: string;
}

export async function submitSignup(payload: LoginPayload): Promise<{ error?: string }> {
  const supabase = createClient();

  // 1. Create the login account. The database trigger (03) makes the profile rows automatically.
  const { data: signUp, error: signUpError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: { first_name: payload.firstName, last_name: payload.lastName } },
  });
  if (signUpError) return { error: signUpError.message };

  const user = signUp.user;
  if (!user || !signUp.session) {
    // No session means "Confirm email" is still ON in Supabase, so the picks would be blocked by RLS.
    return {
      error: "Account created but not signed in. Turn off 'Confirm email' in Supabase Auth settings for testing.",
    };
  }

  // 2. Look up the numeric option_id for every (question_id, option_value) pair.
  const { data, error: optionsError } = await supabase
    .from("answer_option")
    .select("option_id, question_id, option_value")
    .in("question_id", Object.values(QUESTION_IDS));
  if (optionsError || !data) return { error: optionsError?.message ?? "Could not load answer options" };

  const lookup = new Map<string, number>();
  for (const o of data as OptionRow[]) {
    lookup.set(`${o.question_id}:${o.option_value}`, o.option_id);
  }

  // 3. Turn the picks from the form into rows for user_selected_option.
  const rows: { user_id: string; option_id: number }[] = [];
  const fields = Object.keys(QUESTION_IDS) as QuestionField[];
  for (const field of fields) {
    const questionId = QUESTION_IDS[field];
    for (const value of payload[field]) {
      const optionId = lookup.get(`${questionId}:${value}`);
      if (optionId === undefined) {
        return { error: `No database option for "${value}" on question ${questionId}` };
      }
      rows.push({ user_id: user.id, option_id: optionId });
    }
  }

  const { error: pickError } = await supabase.from("user_selected_option").insert(rows);
  if (pickError) return { error: pickError.message };

  // 4. (Extra) save the other things the form collected. The trigger only fills in the name.
  const month = payload.dobMonth.padStart(2, "0");
  const day = payload.dobDay.padStart(2, "0");

  const { error: publicError } = await supabase
    .from("public_profile")
    .update({ handle: payload.handle, display_name: payload.displayName, bio: payload.bio })
    .eq("user_id", user.id);
  if (publicError) return { error: publicError.message };

  const { error: privateError } = await supabase
    .from("user_profile")
    .update({
      date_of_birth: `${payload.dobYear}-${month}-${day}`,
      country: payload.country,
      gender: payload.gender,
    })
    .eq("user_id", user.id);
  if (privateError) return { error: privateError.message };

  // 5. Typed answers (for later): there are no typed questions in the form yet. When there are, use:
  // await supabase.from("user_written_response").upsert({ user_id: user.id, question_id: 9, response_text: "..." });

  return {};
}