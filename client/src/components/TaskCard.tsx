import { motion } from "framer-motion";
import type { TaskItem } from "../types/book";

// A TBL "listing" task stop: the reader taps items to build their own
// answer before the story reveals the real outcome (Willis 1996/2006's
// task cycle). No right/wrong feedback shown here on purpose - the
// comparison happens on the following report/resolution page, so this
// stays a genuine task (outcome still unknown) rather than a quiz.
export function TaskCard({
  items,
  selected,
  onToggle,
}: {
  items: TaskItem[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => {
        const isSelected = selected.includes(item.id);
        return (
          <motion.button
            key={item.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onToggle(item.id)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center gap-1 rounded-2xl border-4 py-4 transition-colors ${
              isSelected
                ? "border-amber-400 bg-amber-100"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
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
