import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { TeachingMethod } from "../types/book";
import { METHOD_META } from "../data/methodMeta";

const COLORS: Record<TeachingMethod, string> = {
  TBL: "bg-orange-100 text-orange-700 border-orange-300",
  CLIL: "bg-violet-100 text-violet-700 border-violet-300",
  CLT: "bg-slate-100 text-slate-600 border-slate-300",
};

// Tapping the badge reveals why the book earned this label, as a fixed
// bottom sheet (same pattern as VocabPanel) rather than an anchored
// dropdown — an absolutely-positioned popover would get clipped by the
// book card's overflow-hidden (needed for the rounded cover-image corners).
export function MethodBadge({ method, reason }: { method: TeachingMethod; reason: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-xs font-extrabold ${COLORS[method]}`}
      >
        {method}
        <span className="text-[10px] opacity-60">ⓘ</span>
      </motion.button>

      {createPortal(
        <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:pb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div
              className={`w-full max-w-xl rounded-3xl border-4 bg-white p-5 shadow-xl ${COLORS[method].split(" ")[2]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block rounded-full border-2 px-2.5 py-0.5 text-xs font-extrabold ${COLORS[method]}`}>
                    {method}
                  </span>
                  <p className="mt-1.5 font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
                    {METHOD_META[method].label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  aria-label="Close"
                  className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 font-body text-sm text-stone-700">{reason}</p>
            </div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
