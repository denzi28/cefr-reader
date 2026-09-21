// CEFR levels supported by the library.
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// One vector "sprite" placed inside a page's illustration scene.
// Rendering the scene is a client concern; the server only describes
// what should appear so the same data can drive a web or mobile client.
export interface SceneItem {
  sprite: string; // e.g. "Dog", "Sun", "Tree" — must match a sprite the client knows
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

export interface BookPage {
  index: number;
  // Page text. Vocabulary words are wrapped like {{ball}} so the client
  // can render them as tappable words linked to the page's vocab list.
  text: string;
  scene: Scene;
  vocab: VocabEntry[];
}

export interface Book {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  pages: BookPage[];
}

// Lightweight shape returned by list endpoints (no page bodies).
export interface BookSummary {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  pageCount: number;
}

export interface LevelInfo {
  level: CEFRLevel;
  label: string;
  description: string;
  bookCount: number;
}
