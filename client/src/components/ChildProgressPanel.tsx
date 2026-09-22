import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../api/client";
import { AVAILABLE_LEVELS } from "../data/levelMeta";
import { LEVEL_BOOK_ORDER } from "../data/bookOrder";
import { listProgressForProfile, type ReadingProgress } from "../data/profiles";
import type { Book, BookSummary, CEFRLevel } from "../types/book";

// A parent-facing breakdown of one child's reading, grouped by level
// rather than listed by most-recently-touched. The flat list it replaced
// was ordered by whatever the child happened to open last, which made it
// impossible to answer the actual question a parent has ("how far
// through A1 are they?").
//
// Every book in a level is listed, not just the started ones, so "3 of 4
// read" is a real denominator. TPR books are left out for the same
// reason children never see them (they need a caregiver reading commands
// aloud, not solo reading) - counting them would make every level look
// permanently unfinished.

interface BookRow {
  book: BookSummary;
  progress: ReadingProgress | null;
}

interface LevelGroup {
  level: CEFRLevel;
  rows: BookRow[];
  readCount: number;
}

// Books a child unlocks in a defined order are shown in that order;
// anything outside it keeps the library's own order, after them.
function sortByUnlockOrder(books: BookSummary[], level: CEFRLevel): BookSummary[] {
  const order = LEVEL_BOOK_ORDER[level];
  if (!order) return books;
  return [...books].sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
}

function CoverThumb({ book }: { book: BookSummary }) {
  // Letterboxd-style poster tile. Falls back to the book's initial on a
  // tinted square when a cover image is missing or fails to load, so the
  // row never collapses to a broken-image icon.
  const [failed, setFailed] = useState(false);
  if (book.coverImageUrl && !failed) {
    return (
      <img
        src={book.coverImageUrl}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-14 w-11 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-stone-900/10"
      />
    );
  }
  return (
    <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg font-extrabold text-stone-400 ring-1 ring-stone-900/10">
      {book.title.charAt(0)}
    </span>
  );
}

function QuizMistakes({ bookId, wrongIds }: { bookId: string; wrongIds: string[] }) {
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Cheap: every book comes from the same cached books.json fetch.
    api
      .getBook(bookId)
      .then((b) => !cancelled && setBook(b))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  if (!book?.quiz) return null;
  const missed = book.quiz.filter((q) => wrongIds.includes(q.id));
  if (missed.length === 0) return null;

  return (
    <ul className="mt-2 space-y-2 rounded-xl bg-rose-50/70 p-3">
      {missed.map((q) => {
        const answer = q.options.find((o) => o.correct);
        return (
          <li key={q.id} className="font-body text-xs leading-relaxed text-stone-600">
            <span className="font-bold text-rose-600">Missed:</span> {q.question}
            {answer && (
              <span className="mt-0.5 block text-emerald-700">
                Correct answer: {answer.emoji} {answer.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function BookProgressRow({ row }: { row: BookRow }) {
  const { book, progress } = row;
  const [open, setOpen] = useState(false);

  const started = !!progress;
  const finished = !!progress?.completed;
  const quizTotal = progress?.quiz_total ?? null;
  const quizCorrect = progress?.quiz_correct ?? null;
  const wrongIds = progress?.quiz_wrong_ids ?? null;
  const missedCount = quizTotal != null && quizCorrect != null ? quizTotal - quizCorrect : 0;
  // Only expandable when there's something more to show than the summary
  // line already says.
  const hasDetail = missedCount > 0 && !!wrongIds?.length;

  const statusText = finished
    ? "Finished 🎉"
    : started
      ? `Page ${(progress?.current_page_index ?? 0) + 1} of ${book.pageCount}`
      : "Not started yet";

  const body = (
    <>
      <CoverThumb book={book} />
      <div className="min-w-0 flex-1 text-left">
        <p className={`truncate font-body text-sm font-bold ${started ? "text-stone-700" : "text-stone-400"}`}>
          {book.title}
        </p>
        <p className={`font-body text-xs ${finished ? "text-emerald-600" : "text-stone-400"}`}>{statusText}</p>
        {quizTotal != null && (
          <p className="mt-0.5 font-body text-xs font-extrabold">
            <span className={missedCount === 0 ? "text-emerald-600" : "text-amber-600"}>
              Quiz {quizCorrect}/{quizTotal} {missedCount === 0 ? "⭐" : ""}
            </span>
            {missedCount > 0 && (
              <span className="ml-1 font-normal text-stone-400">
                {hasDetail ? (open ? "· hide mistakes" : "· see mistakes") : `· missed ${missedCount}`}
              </span>
            )}
          </p>
        )}
      </div>
    </>
  );

  return (
    <li className="py-2">
      {hasDetail ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center gap-3 rounded-xl text-left transition hover:bg-stone-50"
        >
          {body}
        </button>
      ) : (
        <div className="flex w-full items-center gap-3">{body}</div>
      )}
      <AnimatePresence initial={false}>
        {open && hasDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <QuizMistakes bookId={book.id} wrongIds={wrongIds ?? []} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function LevelGroupCard({ group }: { group: LevelGroup }) {
  const [open, setOpen] = useState(false);
  const total = group.rows.length;
  const pct = total === 0 ? 0 : Math.round((group.readCount / total) * 100);
  const allDone = total > 0 && group.readCount === total;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-stone-100">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-stone-50"
      >
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm font-extrabold text-stone-700">
            {group.level} Books{" "}
            <span className={allDone ? "text-emerald-600" : "text-stone-400"}>
              {group.readCount}/{total} read {allDone && "🏆"}
            </span>
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${allDone ? "bg-emerald-400" : "bg-sky-400"}`}
            />
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 font-body text-xs text-stone-400"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <ul className="divide-y divide-stone-100 border-t border-stone-100 px-3">
              {group.rows.map((row) => (
                <BookProgressRow key={row.book.id} row={row} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ChildProgressPanel({ profileId }: { profileId: number }) {
  const [groups, setGroups] = useState<LevelGroup[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getBooks(), listProgressForProfile(profileId)])
      .then(([books, rows]) => {
        if (cancelled) return;
        const byBookId = new Map(rows.map((r) => [r.book_id, r]));
        const childBooks = books.filter((b) => b.teachingMethod !== "TPR");
        const built = AVAILABLE_LEVELS.map((level) => {
          const levelBooks = sortByUnlockOrder(
            childBooks.filter((b) => b.level === level),
            level
          );
          const bookRows: BookRow[] = levelBooks.map((book) => ({
            book,
            progress: byBookId.get(book.id) ?? null,
          }));
          return {
            level,
            rows: bookRows,
            readCount: bookRows.filter((r) => r.progress?.completed).length,
          };
        }).filter((g) => g.rows.length > 0);
        setGroups(built);
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
      });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return (
    <div className="mt-4 border-t border-stone-100 pt-3">
      <p className="mb-2 font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
        Reading progress
      </p>
      {groups === null && <p className="font-body text-xs text-stone-400">Loading…</p>}
      {groups?.length === 0 && (
        <p className="font-body text-xs text-stone-400">No books to show yet.</p>
      )}
      {groups && groups.length > 0 && (
        <div className="space-y-2">
          {groups.map((group) => (
            <LevelGroupCard key={group.level} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
