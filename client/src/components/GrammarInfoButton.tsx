import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// Small "i" button revealing which grammar points this book's text uses,
// checked against its CEFR level during authoring. Portaled to <body> for
// the same reason as VocabPanel/MethodBadge: position: fixed inside the
// route-transition wrapper gets trapped by its animated transform.
export function GrammarInfoButton({ features }: { features: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        aria-label="Grammar used in this book"
        title="Grammar used in this book"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-stone-300 bg-white font-body text-sm font-extrabold text-stone-500 shadow-sm hover:border-stone-400"
      >
        i
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-30 bg-stone-900/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:pb-6"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                <div className="w-full max-w-xl rounded-3xl border-4 border-stone-200 bg-white p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
                      Grammar in this book
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-body text-sm text-stone-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
