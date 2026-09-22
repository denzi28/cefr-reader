import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

// Kept deliberately short - a visitor should see the whole thing with one
// scroll, not a long marketing page. A rotating feature carousel does the
// work of several sections in one fixed-height card instead.
const FEATURES = [
  {
    emoji: "📖",
    title: "CEFR-Leveled Stories",
    text: "Real picture books from A1 to C2, each one carefully leveled to how kids actually learn.",
  },
  {
    emoji: "🎨",
    title: "AI-Illustrated Worlds",
    text: "Every page comes alive with its own AI-generated artwork.",
  },
  {
    emoji: "🎯",
    title: "Real Teaching Methods",
    text: "TBL, CLIL, TPR and more - grounded in real ELT coursework, not just labels.",
  },
  {
    emoji: "🏆",
    title: "Quizzes & Level-Ups",
    text: "Kids unlock books one by one, then pass a Big Quiz to level up to the next stage.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Parent Dashboard",
    text: "Track every child's reading progress and quiz scores, all in one place.",
  },
];

export function WelcomePage() {
  const { user, loading } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FEATURES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const feature = FEATURES[index];

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8">
      <header className="text-center">
        <p className="text-5xl">🐣</p>
        <h1 className="mt-2 text-3xl font-extrabold text-stone-800 sm:text-4xl">Story Levels</h1>
        <p className="mt-2 font-body text-stone-500">
          Picture books leveled to how kids actually learn English, from CEFR A1 to C2.
        </p>
      </header>

      <div className="relative mt-6 h-52 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center"
          >
            <span className="text-4xl">{feature.emoji}</span>
            <h2 className="text-lg font-extrabold text-stone-800">{feature.title}</h2>
            <p className="font-body text-sm text-stone-500">{feature.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show feature ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${i === index ? "bg-sky-500" : "bg-stone-200"}`}
            />
          ))}
        </div>
      </div>

      {/* The library is behind the front door, so the only way onward is
          signing up or in - except for someone already signed in, who
          would otherwise be stranded here with no way back to the books. */}
      <div className="mt-6 flex flex-col gap-2">
        {!loading && user ? (
          <Link
            to="/levels"
            className="rounded-2xl bg-sky-500 py-3 text-center font-extrabold text-white shadow-sm transition hover:bg-sky-600"
          >
            Continue to the Books →
          </Link>
        ) : (
          <>
            <Link
              to="/signup"
              className="rounded-2xl bg-sky-500 py-3 text-center font-extrabold text-white shadow-sm transition hover:bg-sky-600"
            >
              Create a Free Account
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border-2 border-stone-200 bg-white py-3 text-center font-body font-bold text-stone-600 transition hover:bg-stone-50"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      <footer className="mt-6 text-center font-body text-xs text-stone-400">
        Story text © {new Date().getFullYear()} Deniz Berk Çakır. Illustrations created with AI.
      </footer>
    </div>
  );
}
