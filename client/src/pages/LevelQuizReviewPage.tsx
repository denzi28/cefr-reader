import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useActiveProfile } from "../auth/ActiveProfileContext";
import { getLevelQuizAttempt } from "../data/levelQuizAttempts";
import { LEVEL_UP_QUIZZES, type LevelUpQuizQuestion } from "../data/levelUpQuizzes";
import type { CEFRLevel } from "../types/book";

export function LevelQuizReviewPage() {
  const { level } = useParams<{ level: string }>();
  const { activeProfile, loading: profileLoading } = useActiveProfile();
  const [wrongQuestions, setWrongQuestions] = useState<LevelUpQuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cefrLevel = level as CEFRLevel;
  const quiz = LEVEL_UP_QUIZZES[cefrLevel];

  useEffect(() => {
    if (!activeProfile || !quiz) return;
    getLevelQuizAttempt(activeProfile.id, cefrLevel)
      .then((attempt) => {
        const wrongIds = new Set(attempt?.wrong_question_ids ?? []);
        setWrongQuestions(quiz.questions.filter((q) => wrongIds.has(q.id)));
      })
      .catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile?.id, cefrLevel]);

  if (profileLoading) {
    return <p className="p-10 text-center font-body text-stone-400">Loading…</p>;
  }

  if (!activeProfile) return <Navigate to="/" replace />;

  if (!quiz) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">🚧</p>
        <h1 className="mt-3 text-xl font-extrabold text-stone-800">No big quiz here yet</h1>
        <Link to={`/levels/${level}`} className="mt-6 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to {level} books
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="rounded-xl bg-rose-50 p-4 font-body text-rose-600">Couldn't load your last attempt: {error}.</p>
        <Link to={`/levels/${level}`} className="mt-4 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to {level} books
        </Link>
      </div>
    );
  }

  if (wrongQuestions === null) {
    return <p className="p-10 text-center font-body text-stone-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to={`/levels/${level}`} className="font-body text-sm font-bold text-sky-600 hover:underline">
        ← {level} Books
      </Link>

      <header className="my-6 text-center">
        <p className="text-3xl">📝</p>
        <h1 className="mt-1 text-2xl font-extrabold text-stone-800">Let's Review Your Mistakes</h1>
        <p className="mt-1 font-body text-stone-500">
          {wrongQuestions.length === 0
            ? "Nothing to review - your last try had no mistakes!"
            : `Here's what to look at from your last try (${wrongQuestions.length} question${wrongQuestions.length === 1 ? "" : "s"}).`}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {wrongQuestions.map((q, i) => {
          const correctOption = q.options.find((o) => o.correct);
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl border-4 border-white bg-white p-5 shadow-sm"
            >
              <h2 className="font-extrabold text-stone-800">{q.question}</h2>
              {correctOption && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3">
                  <span className="text-xl">{correctOption.emoji}</span>
                  <span className="font-body font-bold text-emerald-700">{correctOption.label}</span>
                  <span className="ml-auto font-body text-xs font-extrabold uppercase tracking-wide text-emerald-500">
                    Correct
                  </span>
                </div>
              )}
              <p className="mt-3 font-body text-sm text-stone-600">{q.explanation}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <Link
          to={`/levels/${level}/level-up-quiz`}
          className="rounded-2xl bg-sky-500 px-6 py-3 text-center font-extrabold text-white shadow-sm hover:bg-sky-600"
        >
          Retake the Quiz
        </Link>
        <Link
          to={`/levels/${level}`}
          className="rounded-2xl border-2 border-stone-200 px-6 py-3 font-body font-bold text-stone-500 hover:bg-stone-50"
        >
          Back to Books
        </Link>
      </div>
    </div>
  );
}
