import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../api/client";
import type { BookSummary, LevelInfo, TeachingMethod } from "../types/book";
import { LevelBadge } from "../components/LevelBadge";
import { BookCard } from "../components/BookCard";
import { METHOD_META, METHOD_ORDER } from "../data/methodMeta";
import { useAuth } from "../auth/AuthContext";
import { useActiveProfile } from "../auth/ActiveProfileContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

type MethodFilter = "ALL" | TeachingMethod;

// A single trigger + bottom sheet instead of a wrapping row of 8 chips,
// which reflowed messily across lines as options were added/selected.
function MethodFilterMenu({
  value,
  onChange,
}: {
  value: MethodFilter;
  onChange: (v: MethodFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentLabel = value === "ALL" ? "All levels" : value;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto flex items-center gap-2 rounded-full border-2 border-stone-300 bg-white px-5 py-2 font-body text-sm font-extrabold text-stone-600 shadow-sm transition hover:border-stone-400"
      >
        <span className="text-stone-400">Filter:</span>
        {currentLabel}
        <span className="text-stone-400">▾</span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-30 bg-stone-900/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:pb-6"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                <div className="max-h-[70vh] w-full max-w-xl overflow-y-auto rounded-3xl border-4 border-stone-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between px-2 pb-2 pt-1">
                    <p className="font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
                      Filter by teaching method
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
                    >
                      ✕
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onChange("ALL");
                      setOpen(false);
                    }}
                    className={`block w-full rounded-2xl px-4 py-3 text-left transition ${
                      value === "ALL" ? "bg-stone-700 text-white" : "hover:bg-stone-50"
                    }`}
                  >
                    <p className="font-body font-extrabold">All levels</p>
                    <p className={`font-body text-xs ${value === "ALL" ? "text-stone-200" : "text-stone-400"}`}>
                      Browse by CEFR level instead of teaching method.
                    </p>
                  </button>

                  {METHOD_ORDER.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        onChange(m);
                        setOpen(false);
                      }}
                      className={`block w-full rounded-2xl px-4 py-3 text-left transition ${
                        value === m ? "bg-stone-700 text-white" : "hover:bg-stone-50"
                      }`}
                    >
                      <p className="font-body font-extrabold">{m}</p>
                      <p className={`font-body text-xs ${value === m ? "text-stone-200" : "text-stone-400"}`}>
                        {METHOD_META[m].description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function AccountLink() {
  const { user, loading } = useAuth();
  const { activeProfile } = useActiveProfile();

  if (loading) return null;

  return (
    <Link
      to={user ? "/dashboard" : "/login"}
      className="fixed right-4 top-4 z-20 flex items-center gap-2 rounded-full border-2 border-stone-200 bg-white px-4 py-2 font-body text-sm font-extrabold text-stone-600 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
    >
      {user ? (
        <>
          <span>{activeProfile ? activeProfile.avatar_emoji : "👤"}</span>
          {activeProfile ? `Reading as ${activeProfile.name}` : "Dashboard"}
        </>
      ) : (
        <>👋 Sign in</>
      )}
    </Link>
  );
}

export function LevelsPage() {
  const { activeProfile } = useActiveProfile();
  const [levels, setLevels] = useState<LevelInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("ALL");
  const [filteredBooks, setFilteredBooks] = useState<BookSummary[] | null>(null);
  // The teaching-method filter is a book-selection tool for the parent or
  // teacher (it assumes you know what "CLIL" or "TPR" means) - hidden once
  // someone is reading "as" a named child profile.
  const showMethodFilter = !activeProfile;

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
      <AccountLink />
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

      {showMethodFilter && (
        <div className="mb-10 flex justify-center">
          <MethodFilterMenu value={methodFilter} onChange={setMethodFilter} />
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-rose-50 p-4 text-center font-body text-rose-600">
          Couldn't load books: {error}.
        </p>
      )}

      {showMethodFilter && methodFilter !== "ALL" ? (
        <>
          {!filteredBooks && !error && (
            <p className="text-center font-body text-stone-400">Loading {methodFilter} books…</p>
          )}
          {filteredBooks && filteredBooks.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-body text-stone-600">
                No {methodFilter} books yet - {METHOD_META[methodFilter as TeachingMethod].label.toLowerCase()}.
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
