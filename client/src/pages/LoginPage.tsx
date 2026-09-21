import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signInWithEmail(email, password);
    setBusy(false);
    if (error) setError(error);
    else navigate("/dashboard");
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-4 border-white bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-extrabold text-stone-800">Parent / Teacher Login</h1>
        <p className="mt-2 text-center font-body text-sm text-stone-500">
          Sign in to manage child profiles and track reading progress.
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
            placeholder="Password"
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
            {busy ? "Signing in…" : "Sign In"}
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
          New here?{" "}
          <Link to="/signup" className="font-bold text-sky-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.79 2.73v2.27h2.9c1.7-1.56 2.69-3.87 2.69-6.64z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.27c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34C2.44 15.98 5.48 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.69A5.4 5.4 0 013.68 9c0-.59.1-1.16.27-1.69V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
