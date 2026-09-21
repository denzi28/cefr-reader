import { supabase } from "../lib/supabase";

export interface LevelQuizAttempt {
  id: number;
  profile_id: number;
  level: string;
  correct: number;
  total: number;
  wrong_question_ids: string[];
  updated_at: string;
}

export async function getLevelQuizAttempt(
  profileId: number,
  level: string
): Promise<LevelQuizAttempt | null> {
  const { data, error } = await supabase
    .from("level_quiz_attempts")
    .select("*")
    .eq("profile_id", profileId)
    .eq("level", level)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Upserts the child's latest attempt at a level's Big Quiz - only the
// most recent attempt matters for the "retake" vs "review mistakes" CTA,
// so a retake simply replaces the previous row rather than appending.
export async function saveLevelQuizAttempt(
  profileId: number,
  level: string,
  correct: number,
  total: number,
  wrongQuestionIds: string[]
): Promise<void> {
  const { error } = await supabase.from("level_quiz_attempts").upsert(
    {
      profile_id: profileId,
      level,
      correct,
      total,
      wrong_question_ids: wrongQuestionIds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id,level" }
  );
  if (error) throw error;
}
