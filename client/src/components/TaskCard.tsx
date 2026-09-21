import { motion } from "framer-motion";
import type { PageTask, TaskItem } from "../types/book";

// A TBL task stop: the reader builds their own answer before the story
// reveals the real outcome (Willis 1996/2006's task cycle). No right/wrong
// feedback shown here on purpose - the comparison happens on the following
// report/resolution page, so this stays a genuine task (outcome still
// unknown) rather than a quiz.
//
// "order" mode shows the tap sequence as a number badge instead of a
// highlight, since position (not just membership) is what's being judged.
export function TaskCard({
  task,
  selected,
  onToggle,
}: {
  task: PageTask;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {task.items.map((item) => {
        const orderPosition = task.mode === "order" ? selected.indexOf(item.id) : -1;
        const isSelected = task.mode === "order" ? orderPosition !== -1 : selected.includes(item.id);
        return (
          <motion.button
            key={item.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onToggle(item.id)}
            aria-pressed={isSelected}
            className={`relative flex flex-col items-center gap-1 rounded-2xl border-4 py-4 transition-colors ${
              isSelected
                ? "border-amber-400 bg-amber-100"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            {task.mode === "order" && orderPosition !== -1 && (
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 font-body text-sm font-extrabold text-white shadow">
                {orderPosition + 1}
              </span>
            )}
            <motion.span
              className="text-4xl"
              animate={isSelected ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {item.emoji}
            </motion.span>
            <span className="font-body text-sm font-bold capitalize text-stone-700">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Shared comparison logic used by ReaderPage to render the "report" stage
// on the page right after a task stop. "multi"/"order" report both a
// correct count AND a wrong count - silently ignoring a wrong tap (as
// "2 of 3 correct" does) hides a real mistake the reader made, which
// defeats the point of a task's report stage.
export function compareTaskAnswer(task: PageTask, selected: string[]) {
  if (task.mode === "single") {
    const correctItem = task.items.find((i) => i.correct) as TaskItem;
    const guessedId = selected[0];
    const isCorrect = guessedId === correctItem.id;
    return { mode: "single" as const, isCorrect, correctLabel: correctItem.label, correctEmoji: correctItem.emoji };
  }
  if (task.mode === "order") {
    // For each position the reader placed an item in, does that item's
    // correctOrder match the position (1-based)? Anything placed but not
    // in its correct slot counts as wrong, not just "not counted."
    let correct = 0;
    let wrong = 0;
    selected.forEach((id, i) => {
      const item = task.items.find((it) => it.id === id);
      if (item?.correctOrder === i + 1) correct++;
      else wrong++;
    });
    return { mode: "order" as const, correct, wrong };
  }
  const correct = selected.filter((id) => task.items.find((it) => it.id === id)?.correct).length;
  const wrong = selected.length - correct;
  return { mode: "multi" as const, correct, wrong };
}
