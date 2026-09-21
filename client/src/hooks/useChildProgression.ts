import { useEffect, useState } from "react";
import { listProgressForProfile, type ChildProfile } from "../data/profiles";
import { LEVEL_BOOK_ORDER } from "../data/bookOrder";
import { LEVEL_ORDER } from "../data/levelMeta";
import type { CEFRLevel } from "../types/book";

// Shared by LevelBooksPage (which book cards to lock), ReaderPage (block
// opening a locked book directly by URL), and LevelUpQuizPage (has this
// level actually been fully read yet?) - one fetch of this child's
// reading_progress, reused everywhere the "what can this child open
// right now" question comes up.
export function useChildProgression(profile: ChildProfile | null) {
  const [completedIds, setCompletedIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!profile) {
      setCompletedIds(null);
      return;
    }
    let cancelled = false;
    listProgressForProfile(profile.id)
      .then((rows) => {
        if (cancelled) return;
        setCompletedIds(new Set(rows.filter((r) => r.completed).map((r) => r.book_id)));
      })
      .catch(() => {
        if (!cancelled) setCompletedIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  function isLevelUnlocked(level: CEFRLevel): boolean {
    if (!profile) return true;
    const unlocked = (profile.unlocked_level || "A1") as CEFRLevel;
    return LEVEL_ORDER.indexOf(level) <= LEVEL_ORDER.indexOf(unlocked);
  }

  // A book is locked only if it's part of a defined unlock order for its
  // level and the book immediately before it hasn't been finished yet.
  // Books outside a defined order (or when there's no active profile at
  // all) are never locked.
  function isBookLocked(bookId: string, level: CEFRLevel): boolean {
    if (!profile || completedIds === null) return false;
    const order = LEVEL_BOOK_ORDER[level];
    if (!order) return false;
    const idx = order.indexOf(bookId);
    if (idx <= 0) return false;
    return !completedIds.has(order[idx - 1]);
  }

  function previousBookId(bookId: string, level: CEFRLevel): string | null {
    const order = LEVEL_BOOK_ORDER[level];
    if (!order) return null;
    const idx = order.indexOf(bookId);
    if (idx <= 0) return null;
    return order[idx - 1];
  }

  function isLevelFullyCompleted(level: CEFRLevel): boolean {
    const order = LEVEL_BOOK_ORDER[level];
    if (!order || completedIds === null) return false;
    return order.every((id) => completedIds.has(id));
  }

  return {
    loading: !!profile && completedIds === null,
    isLevelUnlocked,
    isBookLocked,
    previousBookId,
    isLevelFullyCompleted,
  };
}
