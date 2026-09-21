import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";
import type { BookSummary, CEFRLevel } from "../types/book";
import { BookCard } from "../components/BookCard";
import { LevelBadge } from "../components/LevelBadge";
import { useActiveProfile } from "../auth/ActiveProfileContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

export function LevelBooksPage() {
  const { level } = useParams<{ level: string }>();
  const { activeProfile } = useActiveProfile();
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
      .then(setBooks)
      .catch((e) => setError(String(e)));
  }, [level, activeProfile]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="font-body text-sm font-bold text-sky-600 hover:underline">
        ← All levels
      </Link>

      <header className="my-6 flex items-center gap-3">
        {level && <LevelBadge level={level as CEFRLevel} />}
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
          {books.map((book) => (
            <motion.div key={book.id} variants={card} whileTap={{ scale: 0.97 }}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
