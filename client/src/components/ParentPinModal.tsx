import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

// Portaled to <body> for the same reason as VocabPanel/MethodBadge: a
// position: fixed element inside the route-transition wrapper gets
// trapped by its animated transform instead of covering the viewport.
export function ParentPinModal({
  open,
  onClose,
  onUnlock,
}: {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}) {
  const { verifyParentPin, signOut } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // A forgotten PIN must never truly lock the parent out - signing out
  // clears the active child profile entirely (see ActiveProfileContext),
  // so signing back in lands back in unrestricted Parent mode.
  async function handleForgotPin() {
    await signOut();
    navigate("/login");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (verifyParentPin(pin)) {
      setPin("");
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  }

  function handleClose() {
    setPin("");
    setError(false);
    onClose();
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-stone-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:inset-0 sm:items-center sm:pb-0"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm rounded-3xl border-4 border-stone-200 bg-white p-6 text-center shadow-xl"
            >
              <p className="text-3xl">🔒</p>
              <h2 className="mt-1 text-xl font-extrabold text-stone-800">Enter Parent PIN</h2>
              <p className="mt-1 font-body text-sm text-stone-500">
                Switching back to Parent mode needs your 4-digit code.
              </p>

              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                }}
                className={`mt-4 w-full rounded-2xl border-2 px-4 py-3 text-center font-body text-2xl tracking-[0.6em] outline-none ${
                  error ? "border-rose-300 bg-rose-50" : "border-stone-200 focus:border-sky-400"
                }`}
              />
              {error && <p className="mt-2 font-body text-sm font-bold text-rose-500">Incorrect PIN, try again.</p>}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-2xl border-2 border-stone-200 py-3 font-body font-bold text-stone-500 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={pin.length !== 4}
                  className="flex-1 rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-40"
                >
                  Unlock
                </motion.button>
              </div>

              <button
                type="button"
                onClick={handleForgotPin}
                className="mt-4 font-body text-xs font-bold text-stone-400 hover:text-stone-600"
              >
                Forgot your PIN? Sign out instead
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
