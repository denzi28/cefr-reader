import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useActiveProfile } from "../auth/ActiveProfileContext";
import { useChildProgression } from "../hooks/useChildProgression";
import { LEVEL_UP_QUIZZES } from "../data/levelUpQuizzes";
import { LEVEL_META } from "../data/levelMeta";
import { unlockNextLevel } from "../data/profiles";
import { BookQuiz } from "../components/BookQuiz";
import type { CEFRLevel } from "../types/book";

export function LevelUpQuizPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { activeProfile, refreshActiveProfile } = useActiveProfile();
  const progression = useChildProgression(activeProfile);
  const [result, setResult] = useState<{ correct: number; total: number; passed: boolean } | null>(null);

  if (!activeProfile) return <Navigate to="/" replace />;

  const cefrLevel = level as CEFRLevel;
  const quiz = LEVEL_UP_QUIZZES[cefrLevel];

  if (progression.loading) {
    return <p className="p-10 text-center font-body text-stone-400">Loading…</p>;
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">🚧</p>
        <h1 className="mt-3 text-xl font-extrabold text-stone-800">No big quiz here yet</h1>
        <p className="mt-2 font-body text-stone-500">Check back soon - more levels are on the way!</p>
        <Link to={`/levels/${level}`} className="mt-6 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to {level} books
        </Link>
      </div>
    );
  }

  if (!progression.isLevelFullyCompleted(cefrLevel)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">📚</p>
        <h1 className="mt-3 text-xl font-extrabold text-stone-800">Not quite ready yet!</h1>
        <p className="mt-2 font-body text-stone-500">
          Finish every {level} book first, then come back for the Big Quiz.
        </p>
        <Link to={`/levels/${level}`} className="mt-6 inline-block font-body font-bold text-sky-600 hover:underline">
          ← Back to {level} books
        </Link>
      </div>
    );
  }

  function handleFinish(correct: number, total: number) {
    const passed = correct / total >= quiz!.passFraction;
    setResult({ correct, total, passed });
    if (passed && activeProfile) {
      unlockNextLevel(activeProfile.id, quiz!.toLevel)
        .then(() => refreshActiveProfile())
        .catch(() => {});
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <motion.p
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="text-6xl"
        >
          {result.passed ? "🏆" : "💪"}
        </motion.p>
        <h1 className="mt-3 text-2xl font-extrabold text-stone-800">
          You scored {result.correct} out of {result.total}!
        </h1>
        {result.passed ? (
          <>
            <p className="mt-2 font-body text-stone-500">
              Amazing work! You leveled up to {LEVEL_META[quiz.toLevel].label}!
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/levels/${quiz.toLevel}`)}
              className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 font-extrabold text-white shadow-sm hover:bg-emerald-600"
            >
              See {quiz.toLevel} Books →
            </motion.button>
          </>
        ) : (
          <>
            <p className="mt-2 font-body text-stone-500">
              So close! Read the {level} books again to learn a bit more, then try the Big Quiz again.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setResult(null)}
                className="rounded-2xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-sm hover:bg-sky-600"
              >
                Try Again
              </motion.button>
              <Link
                to={`/levels/${level}`}
                className="rounded-2xl border-2 border-stone-200 px-6 py-3 font-body font-bold text-stone-500 hover:bg-stone-50"
              >
                Back to Books
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to={`/levels/${level}`} className="font-body text-sm font-bold text-sky-600 hover:underline">
        ← {level} Books
      </Link>
      <div className="mt-4 overflow-hidden rounded-3xl border-4 border-amber-300 shadow-lg">
        <div className="bg-amber-400 px-6 py-4 text-center">
          <p className="text-3xl">🏆</p>
          <h1 className="mt-1 text-xl font-extrabold text-white">The Big {level} Quiz!</h1>
          <p className="font-body text-sm text-amber-50">Pass this to unlock {quiz.toLevel}!</p>
        </div>
        <BookQuiz questions={quiz.questions} onFinish={handleFinish} />
      </div>
    </div>
  );
}
