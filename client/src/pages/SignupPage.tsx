import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { GoogleIcon } from "./LoginPage";

export function SignupPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signUpWithEmail(email, password);
    setBusy(false);
    if (error) setError(error);
    else setDone(true);
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 text-center">
        <div className="rounded-3xl border-4 border-white bg-white p-8 shadow-lg">
          <p className="text-2xl">📬</p>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-800">Check your email</h1>
          <p className="mt-2 font-body text-stone-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and sign in.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-2xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-sm hover:bg-sky-600"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-4 border-white bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-extrabold text-stone-800">Create a Parent Account</h1>
        <p className="mt-2 text-center font-body text-sm text-stone-500">
          One account, then add a profile for each child.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 p-3 text-center font-body text-sm text-rose-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border-2 border-stone-200 px-4 py-3 font-body text-stone-700 outline-none focus:border-sky-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border-2 border-stone-200 px-4 py-3 font-body text-stone-700 outline-none focus:border-sky-400"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={busy}
            className="mt-2 rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create Account"}
          </motion.button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="font-body text-xs font-bold uppercase text-stone-400">or</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 py-3 font-extrabold text-stone-700 shadow-sm transition hover:bg-stone-50"
        >
          <GoogleIcon /> Continue with Google
        </motion.button>

        <p className="mt-6 text-center font-body text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-sky-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
