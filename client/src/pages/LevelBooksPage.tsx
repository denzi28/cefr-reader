import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";
import type { BookSummary, CEFRLevel } from "../types/book";
import { BookCard } from "../components/BookCard";
import { LevelBadge } from "../components/LevelBadge";
import { PageArt } from "../components/PageArt";
import { useActiveProfile } from "../auth/ActiveProfileContext";
import { useChildProgression } from "../hooks/useChildProgression";
import { LEVEL_UP_QUIZZES } from "../data/levelUpQuizzes";
import { LEVEL_META } from "../data/levelMeta";
import { LEVEL_BOOK_ORDER } from "../data/bookOrder";

// The raw book list comes back in whatever order the data file declares
// (not necessarily the unlock order), which reads confusingly once cards
// are locked - a locked card could appear above the very card that
// unlocks it. Sort by the defined curriculum order when there is one;
// anything not in it (e.g. a level's TPR book, for a parent still
// browsing everything) keeps its relative position at the end.
function sortByUnlockOrder(books: BookSummary[], level: CEFRLevel): BookSummary[] {
  const order = LEVEL_BOOK_ORDER[level];
  if (!order) return books;
  return [...books].sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

function LockedBookCard({ book, unlocksAfterTitle }: { book: BookSummary; unlocksAfterTitle: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border-4 border-white bg-white opacity-60 shadow-sm">
      <div className="relative h-40 w-full">
        <PageArt imageUrl={book.coverImageUrl} scene={book.coverScene} className="h-40 w-full grayscale" />
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40">
          <span className="text-4xl">🔒</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-extrabold text-stone-500">{book.title}</h3>
        <p className="font-body text-sm text-stone-400">Finish "{unlocksAfterTitle}" to unlock this book.</p>
      </div>
    </div>
  );
}

export function LevelBooksPage() {
  const { level } = useParams<{ level: string }>();
  const { activeProfile } = useActiveProfile();
  const progression = useChildProgression(activeProfile);
  const [books, setBooks] = useState<BookSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!level) return;
    setBooks(null);
    api
      .getBooks(level)
      // TPR books rely on a caregiver reading commands aloud and watching
      // the child move - not something the app can offer inside a child's
      // own solo reading session, so they're hidden once a child profile
      // is active (a parent/teacher browsing without one still sees them).
      .then((all) => (activeProfile ? all.filter((b) => b.teachingMethod !== "TPR") : all))
      .then((all) => sortByUnlockOrder(all, level as CEFRLevel))
      .then(setBooks)
      .catch((e) => setError(String(e)));
  }, [level, activeProfile]);

  const cefrLevel = level as CEFRLevel;
  const levelLocked = !!activeProfile && !progression.loading && !progression.isLevelUnlocked(cefrLevel);
  const showLevelUpCta =
    !!activeProfile &&
    !progression.loading &&
    !!books &&
    !!LEVEL_UP_QUIZZES[cefrLevel] &&
    progression.isLevelFullyCompleted(cefrLevel);

  if (levelLocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-3 text-xl font-extrabold text-stone-800">{LEVEL_META[cefrLevel]?.label} is locked</h1>
        <p className="mt-2 font-body text-stone-500">
          Finish the level below and pass its Big Quiz to unlock these books.
        </p>
        <Link to="/" className="mt-6 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to levels
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="font-body text-sm font-bold text-sky-600 hover:underline">
        ← All levels
      </Link>

      <header className="my-6 flex items-center gap-3">
        {level && <LevelBadge level={cefrLevel} />}
        <h1 className="text-3xl font-extrabold text-stone-800">Books</h1>
      </header>

      {error && (
        <p className="rounded-xl bg-rose-50 p-4 text-center font-body text-rose-600">
          Couldn't load books: {error}.
        </p>
      )}

      {!books && !error && <p className="font-body text-stone-400">Loading books…</p>}

      {books && books.length === 0 && (
        <p className="rounded-2xl bg-white p-8 text-center font-body text-stone-500 shadow-sm">
          No books at this level yet. More stories are on the way!
        </p>
      )}

      {books && books.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {books.map((book) => {
            const locked = !!activeProfile && progression.isBookLocked(book.id, cefrLevel);
            if (locked) {
              const prevId = progression.previousBookId(book.id, cefrLevel);
              const prevTitle = books.find((b) => b.id === prevId)?.title ?? "the previous book";
              return (
                <motion.div key={book.id} variants={card}>
                  <LockedBookCard book={book} unlocksAfterTitle={prevTitle} />
                </motion.div>
              );
            }
            return (
              <motion.div key={book.id} variants={card} whileTap={{ scale: 0.97 }}>
                <BookCard book={book} />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {showLevelUpCta && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border-4 border-amber-300 bg-amber-50 p-6 text-center"
        >
          <p className="text-3xl">🏆</p>
          <h2 className="mt-1 text-xl font-extrabold text-stone-800">
            You finished all the {level} books!
          </h2>
          <p className="mt-1 font-body text-stone-600">
            Take the Big Quiz to unlock {LEVEL_UP_QUIZZES[cefrLevel]?.toLevel}!
          </p>
          <Link
            to={`/levels/${level}/level-up-quiz`}
            className="mt-4 inline-block rounded-2xl bg-amber-500 px-6 py-3 font-extrabold text-white shadow-sm hover:bg-amber-600"
          >
            Take the Big Quiz →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
