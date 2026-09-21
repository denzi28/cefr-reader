// Mirrors server/src/types.ts. Kept as a small duplicated contract rather
// than a shared package, since the client and server are separate deployable
// apps (and a future mobile client would define its own copy too).

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// Each of these requires specific structure to earn (see methodMeta.ts for
// the criteria, sourced from the user's ELT coursework); "General" is the
// honest fallback for text that doesn't clear any of their bars yet.
export type TeachingMethod =
  | "TBL"
  | "CLIL"
  | "Story-based"
  | "Theme-based"
  | "TPR"
  | "Drama-based"
  | "General";

export interface SceneItem {
  sprite: string;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}

export interface Scene {
  background: "day" | "park" | "night" | "indoor" | "mystery";
  items: SceneItem[];
}

export interface VocabEntry {
  word: string;
  definition: string;
}

// A single tappable option in a TBL task (see TaskCard.tsx). `correct` is
// used by "multi"/"single" tasks (Willis's Listing/Problem-solving types);
// `correctOrder` (1-based) is used by "order" tasks (Willis's Ordering and
// sorting type) instead.
export interface TaskItem {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
  correctOrder?: number;
}

export interface PageTask {
  // "multi": tap any number of items to build a list (Listing task type).
  // "single": pick exactly one option under uncertainty (Problem-solving/
  // predicting task type).
  // "order": tap items in the sequence you think they happen (Ordering
  // and sorting task type).
  mode: "multi" | "single" | "order";
  items: TaskItem[];
}

export interface BookPage {
  index: number;
  text: string;
  scene: Scene;
  vocab: VocabEntry[];
  // Optional AI-generated (or hand-illustrated) artwork for this page.
  // When present, the reader shows this instead of the vector scene.
  imageUrl?: string;
  // When present, this page is a TBL task stop: the reader taps items to
  // build their own answer *before* the story reveals the real outcome,
  // per Willis (1996)'s task cycle. Replaces the normal image+text
  // rendering with an interactive item grid (see ReaderPage/TaskCard).
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
  // Why this book was labeled with this method, in terms of the specific
  // criteria (task outcome, content-language integration, etc.) - shown
  // to the user when they tap the method badge.
  teachingMethodReason: string;
  // Short grammar-point labels this book's text actually uses, checked
  // against its CEFR level (e.g. an A1 book shouldn't list modal verbs).
  // Shown via the reader's grammar info button.
  grammarFeatures: string[];
  pages: BookPage[];
}

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
