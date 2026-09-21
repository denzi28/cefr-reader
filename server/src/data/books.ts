import type { Book } from "../types.js";
import theRedBall from "./books/the-red-ball.json" with { type: "json" };
import myFamily from "./books/my-family.json" with { type: "json" };
import aDayAtThePark from "./books/a-day-at-the-park.json" with { type: "json" };
import mysteryMissingCat from "./books/mystery-missing-cat.json" with { type: "json" };

// Cast through unknown: the JSON files are hand-authored to match the Book
// shape but TS can't verify the literal union types (level, background) from JSON.
export const BOOKS: Book[] = [
  theRedBall,
  myFamily,
  aDayAtThePark,
  mysteryMissingCat,
] as unknown as Book[];
