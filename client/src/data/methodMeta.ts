import type { TeachingMethod } from "../types/book";

// Grounded in the user's ELT coursework (Teaching English to Young Learners
// I, Assist. Prof. Dilek İnal) — TBL: Willis & Willis 2007, Willis 1996,
// Nunan 2006; CLIL: Coyle, Hood & Marsh 2010; Story-based: the course's own
// "Story-based instruction" deck; Theme-based/TPR: the course's W5-6 deck
// (Asher; theme-based teaching). Drama draws on general ELT reference since
// no course-specific deck for it was found. "General" is the honest
// fallback for text that doesn't clear any of these bars yet.
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
  "Story-based": {
    label: "Story-based Instruction",
    description:
      "The narrative itself has the structural and language features of a well-told story: a clear problem-to-resolution arc, formulaic opening/closing, and patterned, repeated language — not just any text that happens to be a story.",
  },
  "Theme-based": {
    label: "Theme-based Instruction",
    description:
      "Several different activities — not just reading — are linked together by one connecting topic. A single reading text alone doesn't meet this bar; it needs a whole multi-activity unit built around the theme.",
  },
  TPR: {
    label: "Total Physical Response",
    description:
      "The learner physically responds to spoken commands and actions in the target language. Needs embedded action instructions, not just narrative text.",
  },
  "Drama-based": {
    label: "Drama with Young Learners",
    description:
      "The learner acts out, role-plays, or performs part of the language, rather than just reading it.",
  },
  General: {
    label: "General Reading / Vocabulary",
    description:
      "Doesn't yet meet the specific bar for any named methodology above — a plain vocabulary-focused reading text.",
  },
};

export const METHOD_ORDER: TeachingMethod[] = [
  "TBL",
  "CLIL",
  "Story-based",
  "Theme-based",
  "TPR",
  "Drama-based",
  "General",
];
