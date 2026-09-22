import { supabase } from "../lib/supabase";

export interface ChildProfile {
  id: number;
  parent_id: string;
  name: string;
  avatar_emoji: string;
  cefr_level: string | null;
  // The highest level whose books this child has actually unlocked, via
  // completing the level below and passing its level-up quiz. Distinct
  // from cefr_level (the parent's starting pick for the child) - a
  // parent setting cefr_level to B1 for an advanced child unlocks B1
  // immediately (see createProfile), but from then on only passing a
  // level-up quiz advances it further.
  unlocked_level: string;
  created_at: string;
}

export interface ReadingProgress {
  id: number;
  profile_id: number;
  book_id: string;
  current_page_index: number;
  completed: boolean;
  quiz_correct: number | null;
  quiz_total: number | null;
  // Which questions were missed on the last attempt. null means the quiz
  // predates this column (or was never taken); [] means a clean sweep.
  quiz_wrong_ids: string[] | null;
  updated_at: string;
}

export async function listProfiles(): Promise<ChildProfile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function createProfile(
  name: string,
  avatarEmoji: string,
  cefrLevel: string | null = null
): Promise<ChildProfile> {
  const { data: userData } = await supabase.auth.getUser();
  const parentId = userData.user?.id;
  if (!parentId) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      name,
      avatar_emoji: avatarEmoji,
      cefr_level: cefrLevel,
      unlocked_level: cefrLevel ?? "A1",
      parent_id: parentId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProfile(profileId: number): Promise<void> {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  if (error) throw error;
}

export async function listProgressForProfile(profileId: number): Promise<ReadingProgress[]> {
  const { data, error } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("profile_id", profileId);
  if (error) throw error;
  return data;
}

// Upserts progress for a (profile, book) pair - called as the reader turns
// pages, so it's a frequent, low-stakes write (fire-and-forget from the UI).
// Deliberately never touches quiz_correct/quiz_total, so re-reading a book
// (which fires this on every page turn again) can't wipe an earlier score.
export async function saveProgress(
  profileId: number,
  bookId: string,
  currentPageIndex: number,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("reading_progress")
    .upsert(
      { profile_id: profileId, book_id: bookId, current_page_index: currentPageIndex, completed, updated_at: new Date().toISOString() },
      { onConflict: "profile_id,book_id" }
    );
  if (error) throw error;
}

// Records a finished quiz's score. Called after saveProgress has already
// created the (profile, book) row for this reading session, so a plain
// update (not upsert) is enough.
export async function saveQuizScore(
  profileId: number,
  bookId: string,
  correct: number,
  total: number,
  wrongQuestionIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from("reading_progress")
    .update({
      quiz_correct: correct,
      quiz_total: total,
      quiz_wrong_ids: wrongQuestionIds,
      completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", profileId)
    .eq("book_id", bookId);
  if (error) throw error;
}

// Called after a child passes a level's "big quiz" - raises the ceiling
// on which levels' books they can see at all.
export async function unlockNextLevel(profileId: number, nextLevel: string): Promise<void> {
  const { error } = await supabase.from("profiles").update({ unlocked_level: nextLevel }).eq("id", profileId);
  if (error) throw error;
}
