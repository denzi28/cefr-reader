import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// The anon/publishable key is safe to expose client-side by design - access
// control is enforced by Postgres Row Level Security policies, not by
// keeping this key secret. See server/../supabase migrations for the
// policies that actually restrict a parent to their own child profiles.
export const supabase = createClient(url, anonKey);
