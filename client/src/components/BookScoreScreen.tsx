import { motion } from "framer-motion";

function scoreMessage(correct: number, total: number): { emoji: string; text: string } {
  if (correct === total) return { emoji: "🌟", text: "Perfect score! You're a superstar reader!" };
  if (correct >= total / 2) return { emoji: "🎉", text: "Great job! You understood the story well!" };
  return { emoji: "💪", text: "Nice try! Read it again to catch even more." };
}

export function BookScoreScreen({
  correct,
  total,
  onReadAgain,
  onBackToBooks,
}: {
  correct: number;
  total: number;
  onReadAgain: () => void;
  onBackToBooks: () => void;
}) {
  const { emoji, text } = scoreMessage(correct, total);

  return (
    <div className="flex flex-col items-center gap-4 bg-white px-6 py-10 text-center">
      <motion.p
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="text-6xl"
      >
        {emoji}
      </motion.p>
      <h2 className="text-2xl font-extrabold text-stone-800">
        You scored {correct} out of {total}!
      </h2>
      <p className="font-body text-stone-500">{text}</p>

      <div className="mt-4 flex w-full gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onReadAgain}
          className="flex-1 rounded-2xl border-4 border-stone-200 py-3 font-extrabold text-stone-600 shadow-sm transition hover:bg-stone-50"
        >
          Read Again
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onBackToBooks}
          className="flex-1 rounded-2xl bg-emerald-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-emerald-600"
        >
          Back to Books
        </motion.button>
      </div>
    </div>
  );
}
