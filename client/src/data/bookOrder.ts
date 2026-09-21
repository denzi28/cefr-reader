import type { CEFRLevel } from "../types/book";

// The order a child unlocks books in, within each level: the plain
// narrative first (lowest floor to entry), then content-integrated
// (CLIL) books, ending with that level's TBL task book - it demands the
// most, since the reader has to reason through an embedded task rather
// than just read. TPR books are excluded entirely (already hidden from
// children - see LevelBooksPage) since they need a caregiver reading
// commands aloud, not a child's own solo session.
export const LEVEL_BOOK_ORDER: Partial<Record<CEFRLevel, string[]>> = {
  A1: ["the-red-ball", "my-family", "zoe-animal-homes", "ruby-picnic-basket"],
  A2: ["a-day-at-the-park", "sams-four-seasons", "leo-grows-a-sunflower"],
  B1: ["mystery-missing-cat", "bens-missing-backpack", "noras-water-cycle"],
};
