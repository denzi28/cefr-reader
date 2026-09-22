import type { CEFRLevel } from "../types/book";

// Mirrors server/src/data/levels.ts. Duplicated here (rather than fetched)
// because the static-hosted build (see api/client.ts) has no server to ask.
export const LEVEL_META: Record<CEFRLevel, { label: string; description: string }> = {
  A1: {
    label: "A1 - Beginner",
    description: "Very short sentences and everyday words. Perfect for first readers.",
  },
  A2: {
    label: "A2 - Elementary",
    description: "Simple stories about familiar topics, with past tense sentences.",
  },
  B1: {
    label: "B1 - Intermediate",
    description: "Longer stories with more detail, opinions, and connected ideas.",
  },
  B2: {
    label: "B2 - Upper Intermediate",
    description: "More complex plots and richer vocabulary for confident readers.",
  },
  C1: {
    label: "C1 - Advanced",
    description: "Nuanced stories with idioms and varied sentence structures.",
  },
  C2: {
    label: "C2 - Mastery",
    description: "Sophisticated storytelling close to native-level fluency.",
  },
};

// The full CEFR ladder, in order. Used for comparing levels (e.g. "is
// this level unlocked yet?"), not for deciding what to show.
export const LEVEL_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// The levels the app actually offers. B2 and above are written for
// learners older than the children this app is for, so they're held back
// rather than shown as empty levels - see PLANNED_LEVELS.
export const AVAILABLE_LEVELS: CEFRLevel[] = ["A1", "A2", "B1"];

// Announced on the levels page as coming later, so the jump from B1 to
// nothing doesn't look like something is missing or broken.
export const PLANNED_LEVELS: CEFRLevel[] = ["B2", "C1", "C2"];
