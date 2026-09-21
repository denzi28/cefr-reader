import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";
import type { BookSummary, LevelInfo, TeachingMethod } from "../types/book";
import { LevelBadge } from "../components/LevelBadge";
import { BookCard } from "../components/BookCard";
import { METHOD_META, METHOD_ORDER } from "../data/methodMeta";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

type MethodFilter = "ALL" | TeachingMethod;

export function LevelsPage() {
  const [levels, setLevels] = useState<LevelInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("ALL");
  const [filteredBooks, setFilteredBooks] = useState<BookSummary[] | null>(null);

  useEffect(() => {
    api.getLevels().then(setLevels).catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (methodFilter === "ALL") {
      setFilteredBooks(null);
      return;
    }
    setFilteredBooks(null);
    api
      .getBooks(undefined, methodFilter)
      .then(setFilteredBooks)
      .catch((e) => setError(String(e)));
  }, [methodFilter]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-extrabold text-stone-800 sm:text-5xl">
          🐣 Story Levels
        </h1>
        <p className="mt-3 font-body text-lg text-stone-500">
          Pick a level to find picture books just right for you, from CEFR A1 to C2.
        </p>
      </motion.header>

      <div className="mb-10 flex flex-col items-center gap-3">
        <p className="font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
          Filter by teaching method
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setMethodFilter("ALL")}
            className={`rounded-full border-2 px-4 py-1.5 font-body text-sm font-extrabold transition ${
              methodFilter === "ALL"
                ? "border-stone-700 bg-stone-700 text-white"
                : "border-stone-300 bg-white text-stone-500 hover:border-stone-400"
            }`}
          >
            All levels
          </button>
          {METHOD_ORDER.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethodFilter(m)}
              title={METHOD_META[m].description}
              className={`rounded-full border-2 px-4 py-1.5 font-body text-sm font-extrabold transition ${
                methodFilter === m
                  ? "border-stone-700 bg-stone-700 text-white"
                  : "border-stone-300 bg-white text-stone-500 hover:border-stone-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 p-4 text-center font-body text-rose-600">
          Couldn't load books: {error}.
        </p>
      )}

      {methodFilter !== "ALL" ? (
        <>
          {!filteredBooks && !error && (
            <p className="text-center font-body text-stone-400">Loading {methodFilter} books…</p>
          )}
          {filteredBooks && filteredBooks.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-body text-stone-600">
                No {methodFilter} books yet — {METHOD_META[methodFilter as TeachingMethod].label.toLowerCase()}.
              </p>
              <p className="mt-2 font-body text-sm text-stone-400">
                {METHOD_META[methodFilter as TeachingMethod].description}
              </p>
            </div>
          )}
          {filteredBooks && filteredBooks.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredBooks.map((book) => (
                <motion.div key={book.id} variants={card} whileTap={{ scale: 0.97 }}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      ) : (
        <>
          {!levels && !error && (
            <p className="text-center font-body text-stone-400">Loading levels…</p>
          )}

          {levels && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {levels.map((lvl) => (
                <motion.div key={lvl.level} variants={card} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/levels/${lvl.level}`}
                    className={`flex h-full flex-col gap-3 rounded-3xl border-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${
                      lvl.bookCount === 0 ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <LevelBadge level={lvl.level} />
                      <span className="font-body text-sm font-bold text-stone-400">
                        {lvl.bookCount} {lvl.bookCount === 1 ? "book" : "books"}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-stone-800">{lvl.label}</h2>
                    <p className="font-body text-sm text-stone-500">{lvl.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
