import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { LoginPayload } from "@/models/login/payload";

/**
 * Creates the account, then saves the Q2-Q7 checkbox picks (user_selected_option) and the typed answers
 * (user_written_response) under the new user's ID.
 * question_id numbers come from supabase/02_answers.sql
 */
const QUESTION_IDS = {
  interests: 2,
  clothingAesthetics: 3,
  clothingNeeds: 4,
  colorPreference: 5,
  fashionEra: 6,
  subculture: 7,
} as const;

// free-text questions (also from 02_answers.sql)
const WRITTEN_QUESTION_IDS = {
  callMe: 1,
  anythingElse: 9,
  outfitExpression: 10,
  otherStyle: 11,
} as const;

type QuestionField = keyof typeof QUESTION_IDS;

interface OptionRow {
  option_id: number;
  question_id: number;
  option_value: string;
}

export async function submitSignup(payload: LoginPayload): Promise<{ error?: string }> {
  const supabase = createClient();

  // create the login account. The database trigger (03) makes the profile rows automatically
  const { data: signUp, error: signUpError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: { first_name: payload.firstName, last_name: payload.lastName } },
  });
  if (signUpError) return { error: signUpError.message };

  const user = signUp.user;
  if (!user || !signUp.session) {
    // No session means "Confirm email" is still ON in Supabase
    return {
      error: "Account created but not signed in. Turn off 'Confirm email' in Supabase Auth settings for testing.",
    };
  }

  return saveProfile(supabase, user, payload);
}

/**
 * saves everything except the login itself: checkbox picks, profile details and typed answers
 */
async function saveProfile(supabase: SupabaseClient, user: User, payload: LoginPayload): Promise<{ error?: string }> {
  // look up the numeric option_id for every (question_id, option_value) pair.
  const { data, error: optionsError } = await supabase
    .from("answer_option")
    .select("option_id, question_id, option_value")
    .in("question_id", Object.values(QUESTION_IDS));
  if (optionsError || !data) return { error: optionsError?.message ?? "Could not load answer options" };

  const lookup = new Map<string, number>();
  for (const o of data as OptionRow[]) {
    lookup.set(`${o.question_id}:${o.option_value}`, o.option_id);
  }

  // turn the picks from the form into rows for user_selected_option
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

  // save the other things the form collected. the trigger only fills in the name
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
      first_name: payload.firstName,
      last_name: payload.lastName,
      date_of_birth: `${payload.dobYear}-${month}-${day}`,
      country: payload.country,
      gender: payload.gender,
    })
    .eq("user_id", user.id);
  if (privateError) return { error: privateError.message };

  // typed answers go to user_written_response
  // the column is NOT NULL, so blank answers are skipped. Q1 ("What should we call you?") reuses the display name
  const written = [
    { question_id: WRITTEN_QUESTION_IDS.callMe, response_text: payload.displayName },
    { question_id: WRITTEN_QUESTION_IDS.anythingElse, response_text: payload.anythingElse },
    { question_id: WRITTEN_QUESTION_IDS.outfitExpression, response_text: payload.outfitExpression },
    { question_id: WRITTEN_QUESTION_IDS.otherStyle, response_text: payload.otherStyle },
  ]
    .map((r) => ({ ...r, response_text: r.response_text.trim() }))
    .filter((r) => r.response_text.length > 0)
    .map((r) => ({ ...r, user_id: user.id }));

  if (written.length > 0) {
    const { error: writtenError } = await supabase
      .from("user_written_response")
      .upsert(written, { onConflict: "user_id,question_id" });
    if (writtenError) return { error: writtenError.message };
  }

  return {};
}