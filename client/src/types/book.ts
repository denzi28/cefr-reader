// Mirrors server/src/types.ts. Kept as a small duplicated contract rather
// than a shared package, since the client and server are separate deployable
// apps (and a future mobile client would define its own copy too).

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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

export interface BookPage {
  index: number;
  text: string;
  scene: Scene;
  vocab: VocabEntry[];
  // Optional AI-generated (or hand-illustrated) artwork for this page.
  // When present, the reader shows this instead of the vector scene.
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  coverImageUrl?: string;
  pages: BookPage[];
}

export interface BookSummary {
  id: string;
  title: string;
  level: CEFRLevel;
  summary: string;
  coverScene: Scene;
  coverImageUrl?: string;
  pageCount: number;
}

export interface LevelInfo {
  level: CEFRLevel;
  label: string;
  description: string;
  bookCount: number;
}
