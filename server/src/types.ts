// CEFR levels supported by the library.
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// Each of these requires specific structure to earn (see the client's
// data/methodMeta.ts for the criteria, sourced from the user's ELT
// coursework); "General" is the honest fallback for text that doesn't
// clear any of their bars yet.
export type TeachingMethod =
  | "TBL"
  | "CLIL"
  | "Story-based"
  | "Theme-based"
  | "TPR"
  | "Drama-based"
  | "General";

// One vector "sprite" placed inside a page's illustration scene.
// Rendering the scene is a client concern; the server only describes
// what should appear so the same data can drive a web or mobile client.
export interface SceneItem {
  sprite: string; // e.g. "Dog", "Sun", "Tree" - must match a sprite the client knows
  x: number; // 0-100, percent of scene width
  y: number; // 0-100, percent of scene height
  scale?: number; // default 1
  flip?: boolean; // mirror horizontally
}

export interface Scene {
  background: "day" | "park" | "night" | "indoor" | "mystery";
  items: SceneItem[];
}

export interface VocabEntry {
  word: string; // matches a {{word}} token in the page text, case-insensitive
  definition: string; // short, child-friendly definition
}

export interface TaskItem {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
  correctOrder?: number;
}

export interface PageTask {
  mode: "multi" | "single" | "order";
  items: TaskItem[];
}

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
}

// A single-choice comprehension question shown after the last page, for
// books that have one. Distinct from PageTask (an embedded TBL task with
// an unknown outcome mid-story) - a quiz always has one right answer and
// just checks recall.
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface BookPage {
  index: number;
  // Page text. Vocabulary words are wrapped like {{ball}} so the client
  // can render them as tappable words linked to the page's vocab list.
  text: string;
  scene: Scene;
  vocab: VocabEntry[];
  // Optional AI-generated (or hand-illustrated) artwork for this page,
  // e.g. "/images/the-red-ball/page-1.png". When present, the client
  // shows this image instead of rendering `scene` as vector art. See
  // server/scripts/generate-images.mjs for how these get created.
  imageUrl?: string;
  // When present, this page is a TBL task stop (see the client's
  // TaskCard/ReaderPage for the interactive rendering).
  task?: PageTask;
}

export interface Book {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  coverImageUrl?: string;
  teachingMethod: TeachingMethod;
  teachingMethodReason: string;
  // Short grammar-point labels this book's text actually uses, checked
  // against its CEFR level. Shown via the reader's grammar info button.
  grammarFeatures: string[];
  // Playful, kid-facing lines (no jargon, no images) shown before the
  // child starts reading - a translation of grammarFeatures into
  // language a child actually understands. Optional.
  introFunFacts?: string[];
  // A short comprehension quiz shown after the last page, when reading
  // "as" a child profile. Optional.
  quiz?: QuizQuestion[];
  pages: BookPage[];
}

// Lightweight shape returned by list endpoints (no page bodies).
export interface BookSummary {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  coverImageUrl?: string;
  teachingMethod: TeachingMethod;
  teachingMethodReason: string;
  pageCount: number;
}

export interface LevelInfo {
  level: CEFRLevel;
  label: string;
  description: string;
  bookCount: number;
}
