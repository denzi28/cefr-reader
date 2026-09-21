import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { VocabEntry } from "../types/book";

export function VocabPanel({ entry, onClose }: { entry: VocabEntry | null; onClose: () => void }) {
  // Portaled to <body>: the route-transition wrapper in App.tsx animates a
  // `transform`, which turns it into a containing block for any descendant
  // `position: fixed` element - pinning this sheet to that wrapper's own
  // (content-sized) box instead of the real viewport. Rendering outside
  // that subtree avoids the problem entirely.
  return createPortal(
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 sm:pb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          <div className="w-full max-w-xl rounded-3xl border-4 border-amber-300 bg-white shadow-xl p-5 flex items-start gap-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl"
            >
              📖
            </motion.div>
            <div className="flex-1">
              <p className="text-lg font-extrabold capitalize text-amber-700">{entry.word}</p>
              <p className="font-body text-base text-stone-700">{entry.definition}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
