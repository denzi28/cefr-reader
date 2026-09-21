import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../api/client";
import type { Book, VocabEntry } from "../types/book";
import { PageArt } from "../components/PageArt";
import { PageText } from "../components/PageText";
import { VocabPanel } from "../components/VocabPanel";
import { LevelBadge } from "../components/LevelBadge";
import { MethodBadge } from "../components/MethodBadge";
import { GrammarInfoButton } from "../components/GrammarInfoButton";
import { TaskCard, compareTaskAnswer } from "../components/TaskCard";

const pageVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0, rotateY: direction > 0 ? 8 : -8 }),
  center: { x: 0, opacity: 1, rotateY: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0, rotateY: direction > 0 ? -8 : 8 }),
};

export function ReaderPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeWord, setActiveWord] = useState<VocabEntry | null>(null);
  const [taskSelections, setTaskSelections] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (!id) return;
    api
      .getBook(id)
      .then((b) => {
        setBook(b);
        setPageIndex(0);
      })
      .catch((e) => setError(String(e)));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="rounded-xl bg-rose-50 p-4 font-body text-rose-600">Couldn't load this book: {error}.</p>
        <Link to="/" className="mt-4 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to levels
        </Link>
      </div>
    );
  }

  if (!book) {
    return <p className="p-10 text-center font-body text-stone-400">Loading book…</p>;
  }

  const page = book.pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === book.pages.length - 1;

  // If the previous page was a task stop, show how the reader's own list
  // compares to the real answer - the "report" stage of Willis's task
  // cycle, shown here rather than as live right/wrong feedback on the
  // task page itself (which would give the outcome away too early).
  const prevPage = pageIndex > 0 ? book.pages[pageIndex - 1] : null;
  const taskComparison = prevPage?.task
    ? compareTaskAnswer(prevPage.task, taskSelections[pageIndex - 1] ?? [])
    : null;

  function goTo(next: number) {
    setActiveWord(null);
    setDirection(next > pageIndex ? 1 : -1);
    setPageIndex(Math.max(0, Math.min(book!.pages.length - 1, next)));
  }

  function toggleTaskItem(id: string) {
    const mode = page.task?.mode;
    setTaskSelections((prev) => {
      const current = prev[pageIndex] ?? [];
      if (mode === "single") {
        return { ...prev, [pageIndex]: current[0] === id ? [] : [id] };
      }
      if (mode === "order") {
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
        return { ...prev, [pageIndex]: next };
      }
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...prev, [pageIndex]: next };
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-32 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to={`/levels/${book.level}`}
          className="font-body text-sm font-bold text-sky-600 hover:underline"
        >
          ← {book.title}
        </Link>
        <div className="flex items-center gap-2">
          <LevelBadge level={book.level} />
          <MethodBadge method={book.teachingMethod} reason={book.teachingMethodReason} />
          <GrammarInfoButton features={book.grammarFeatures} />
        </div>
      </div>

      <div
        className="overflow-hidden rounded-3xl border-4 border-white shadow-lg ring-1 ring-stone-200"
        style={{ perspective: 1200 }}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={pageIndex}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {page.task ? (
              <div className="bg-white px-6 py-8">
                <p className="mb-5 text-center font-body text-xl font-extrabold text-stone-800">{page.text}</p>
                <TaskCard
                  task={page.task}
                  selected={taskSelections[pageIndex] ?? []}
                  onToggle={toggleTaskItem}
                />
              </div>
            ) : (
              <>
                <PageArt imageUrl={page.imageUrl} scene={page.scene} className="aspect-[5/3] w-full bg-white" />
                <div className="bg-white px-6 py-8 text-center">
                  {taskComparison && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-4 inline-block rounded-full border-2 px-4 py-1.5 font-body text-sm font-extrabold ${
                        (taskComparison.mode === "single" && !taskComparison.isCorrect) ||
                        (taskComparison.mode !== "single" && taskComparison.wrong > 0)
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-emerald-300 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {taskComparison.mode === "single" &&
                        (taskComparison.isCorrect
                          ? "Great guess! You were right! 🎉"
                          : `Good try! It was actually ${taskComparison.correctEmoji} ${taskComparison.correctLabel}.`)}
                      {taskComparison.mode !== "single" &&
                        (taskComparison.wrong > 0
                          ? `You picked ${taskComparison.correct} correct but ${taskComparison.wrong} wrong.`
                          : `You picked ${taskComparison.correct} correct! 🎉`)}
                    </motion.p>
                  )}
                  <PageText
                    text={page.text}
                    vocab={page.vocab}
                    activeWord={activeWord?.word}
                    onWordTap={setActiveWord}
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-center font-body text-sm font-bold text-stone-400">
        Page {pageIndex + 1} of {book.pages.length}
        {page.task?.mode === "multi" && " · tap everything you think is needed, then turn the page to check"}
        {page.task?.mode === "single" && " · pick the one you think is right, then turn the page to check"}
        {page.task?.mode === "order" && " · tap them in the order you think they happen"}
        {!page.task && page.vocab.length > 0 && " · tap the underlined words to see what they mean"}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => goTo(pageIndex - 1)}
          disabled={isFirst}
          className="flex-1 rounded-2xl border-4 border-white bg-white py-3 font-extrabold text-stone-600 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </motion.button>
        {isLast ? (
          <motion.div whileTap={{ scale: 0.94 }} className="flex-1">
            <Link
              to={`/levels/${book.level}`}
              className="block rounded-2xl bg-emerald-500 py-3 text-center font-extrabold text-white shadow-sm transition hover:bg-emerald-600"
            >
              The End 🎉
            </Link>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => goTo(pageIndex + 1)}
            className="flex-1 rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600"
          >
            Next →
          </motion.button>
        )}
      </div>

      <VocabPanel entry={activeWord} onClose={() => setActiveWord(null)} />
    </div>
  );
}
