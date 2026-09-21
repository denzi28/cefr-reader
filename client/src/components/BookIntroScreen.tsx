import { motion } from "framer-motion";

// A playful, text-only warm-up shown before a child starts reading -
// translates the book's grammar features into language a child actually
// understands. No images, per the "test it for A1" scope: this is meant
// to be quick, cheap to author, and never a distraction from the story.
export function BookIntroScreen({ facts, onStart }: { facts: string[]; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 bg-white px-6 py-10 text-center">
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="text-5xl"
      >
        🎈
      </motion.p>
      <h2 className="text-2xl font-extrabold text-stone-800">Get Ready to Read!</h2>

      <div className="flex w-full flex-col gap-3">
        {facts.map((fact, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, type: "spring", stiffness: 300, damping: 24 }}
            className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-left font-body text-stone-700"
          >
            {fact}
          </motion.p>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onStart}
        className="mt-2 w-full rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600"
      >
        Let's Read! 📖
      </motion.button>
    </div>
  );
}
