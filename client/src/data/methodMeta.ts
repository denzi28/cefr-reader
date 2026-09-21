import type { TeachingMethod } from "../types/book";

// Grounded in the user's ELT coursework (Teaching English to Young Learners
// I — TBL: Willis & Willis 2007, Willis 1996, Nunan 2006; CLIL: Coyle, Hood
// & Marsh 2010) plus general ELT reference. These are the bars a book must
// clear to earn each label — see generate-images.mjs sibling script/authoring
// notes for how new books should be written to meet them intentionally.
export const METHOD_META: Record<TeachingMethod, { label: string; description: string }> = {
  TBL: {
    label: "Task-Based Learning",
    description:
      "The reader does a real task with a genuine outcome (list, predict, sequence, decide) using the language — not just reads about one.",
  },
  CLIL: {
    label: "Content & Language Integrated Learning",
    description:
      "Teaches real subject content (science, geography, etc.) and English together, with roughly equal weight on each.",
  },
  CLT: {
    label: "Communicative Language Teaching",
    description:
      "Meaning-focused, communicative language in context — the default when a book doesn't yet meet TBL's task-outcome bar or CLIL's content-integration bar.",
  },
};

export const METHOD_ORDER: TeachingMethod[] = ["TBL", "CLIL", "CLT"];
