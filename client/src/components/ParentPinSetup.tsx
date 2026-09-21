import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

// Shown once, before a parent can use the dashboard at all - guarantees a
// PIN always exists by the time any child profile is created, so the
// profile switcher never has to handle a "switch to Parent" with no PIN
// to check against.
export function ParentPinSetup({ onDone }: { onDone: () => void }) {
  const { setParentPin } = useAuth();
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{4}$/.test(pin)) {
      setError("Please use exactly 4 digits.");
      return;
    }
    if (pin !== confirm) {
      setError("The two codes don't match.");
      return;
    }
    setBusy(true);
    const { error } = await setParentPin(pin);
    setBusy(false);
    if (error) setError(error);
    else onDone();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-3xl border-4 border-amber-200 bg-amber-50 p-5"
    >
      <p className="text-2xl">🔒</p>
      <h2 className="text-lg font-extrabold text-stone-800">Set a Parent PIN</h2>
      <p className="font-body text-sm text-stone-600">
        You'll need this 4-digit code to switch back to Parent mode after reading as one of your
        children.
      </p>

      {error && (
        <p className="rounded-xl bg-rose-50 p-2 text-center font-body text-sm text-rose-600">{error}</p>
      )}

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        autoFocus
        required
        placeholder="Choose a 4-digit PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="rounded-2xl border-2 border-stone-200 px-4 py-3 text-center font-body text-lg tracking-[0.5em] text-stone-700 outline-none focus:border-sky-400"
      />
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        required
        placeholder="Confirm PIN"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="rounded-2xl border-2 border-stone-200 px-4 py-3 text-center font-body text-lg tracking-[0.5em] text-stone-700 outline-none focus:border-sky-400"
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={busy}
        className="rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save PIN"}
      </motion.button>
    </motion.form>
  );
}
