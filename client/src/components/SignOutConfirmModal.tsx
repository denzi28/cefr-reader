import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// Same portal-to-body pattern as ParentPinModal: a position: fixed element
// rendered inside the route-transition wrapper gets trapped by its animated
// transform instead of covering the viewport.
export function SignOutConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-stone-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:inset-0 sm:items-center sm:pb-0"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="w-full max-w-sm rounded-3xl border-4 border-stone-200 bg-white p-6 text-center shadow-xl">
              <p className="text-3xl">👋</p>
              <h2 className="mt-1 text-xl font-extrabold text-stone-800">Sign out?</h2>
              <p className="mt-1 font-body text-sm text-stone-500">
                You'll need to sign back in to get to the books again.
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-2xl border-2 border-stone-200 py-3 font-body font-bold text-stone-500 hover:bg-stone-50"
                >
                  Stay
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 rounded-2xl bg-rose-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-rose-600"
                >
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
