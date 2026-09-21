import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "../types/book";

// A short sequential single-choice comprehension quiz shown after the last
// page. Tapping an option shows correct/wrong immediately (gentle, not
// punitive - matches the rest of the reader's task feedback), then a
// "Next Question" button advances. onFinish reports the final score so
// ReaderPage can persist it and show the score screen.
export function BookQuiz({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  // wrongQuestionIds lets a caller (e.g. the level-up Big Quiz) persist and
  // later review exactly which questions were missed - per-book quizzes
  // just ignore the third argument.
  onFinish: (correct: number, total: number, wrongQuestionIds: string[]) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const question = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;
  const selectedOption = question.options.find((o) => o.id === selectedId);

  function handleSelect(optionId: string) {
    if (selectedId) return;
    setSelectedId(optionId);
    const option = question.options.find((o) => o.id === optionId);
    if (option?.correct) setCorrectCount((c) => c + 1);
    else setWrongIds((ids) => [...ids, question.id]);
  }

  function handleNext() {
    if (isLastQuestion) {
      onFinish(correctCount, questions.length, wrongIds);
      return;
    }
    setQIndex((i) => i + 1);
    setSelectedId(null);
  }

  return (
    <div className="flex flex-col gap-4 bg-white px-6 py-8">
      <p className="text-center font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
        Quiz Time! Question {qIndex + 1} of {questions.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          <h2 className="text-center text-xl font-extrabold text-stone-800">{question.question}</h2>

          <div className="flex flex-col gap-2">
            {question.options.map((option) => {
              const isSelected = selectedId === option.id;
              const revealState = selectedId
                ? option.correct
                  ? "correct"
                  : isSelected
                    ? "wrong"
                    : "neutral"
                : "neutral";
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileTap={{ scale: selectedId ? 1 : 0.97 }}
                  disabled={!!selectedId}
                  onClick={() => handleSelect(option.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-body font-bold transition ${
                    revealState === "correct"
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : revealState === "wrong"
                        ? "border-rose-300 bg-rose-50 text-rose-600"
                        : "border-stone-200 bg-white text-stone-700"
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  {option.label}
                </motion.button>
              );
            })}
          </div>

          {selectedId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center font-body text-sm font-extrabold ${
                selectedOption?.correct ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {selectedOption?.correct ? "Yes! Great job! 🎉" : "Not quite! Good try 💪"}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {selectedId && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleNext}
          className="mt-2 rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600"
        >
          {isLastQuestion ? "See My Score! ⭐" : "Next Question ▸"}
        </motion.button>
      )}
    </div>
  );
}
