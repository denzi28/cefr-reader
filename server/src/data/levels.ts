import type { CEFRLevel } from "../types.js";

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

export const LEVEL_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
