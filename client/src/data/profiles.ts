import { supabase } from "../lib/supabase";

export interface ChildProfile {
  id: number;
  parent_id: string;
  name: string;
  avatar_emoji: string;
  cefr_level: string | null;
  created_at: string;
}

export interface ReadingProgress {
  id: number;
  profile_id: number;
  book_id: string;
  current_page_index: number;
  completed: boolean;
  updated_at: string;
}

export async function listProfiles(): Promise<ChildProfile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function createProfile(name: string, avatarEmoji: string): Promise<ChildProfile> {
  const { data: userData } = await supabase.auth.getUser();
  const parentId = userData.user?.id;
  if (!parentId) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("profiles")
    .insert({ name, avatar_emoji: avatarEmoji, parent_id: parentId })
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
