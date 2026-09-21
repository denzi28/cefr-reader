import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { useActiveProfile } from "../auth/ActiveProfileContext";
import {
  createProfile,
  deleteProfile,
  listProfiles,
  listProgressForProfile,
  type ChildProfile,
} from "../data/profiles";
import { api } from "../api/client";
import { LEVEL_ORDER } from "../data/levelMeta";
import { LevelBadge } from "../components/LevelBadge";
import type { CEFRLevel } from "../types/book";

const AVATAR_CHOICES = ["🦊", "🐰", "🐼", "🦁", "🐸", "🦄", "🐨", "🐯"];

interface BookProgressRow {
  bookId: string;
  title: string;
  level: CEFRLevel;
  pageCount: number;
  currentPageIndex: number;
  completed: boolean;
  quizCorrect: number | null;
  quizTotal: number | null;
}

function ProfileCard({
  profile,
  onActivate,
  onDelete,
}: {
  profile: ChildProfile;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const [progress, setProgress] = useState<BookProgressRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listProgressForProfile(profile.id)
      .then(async (rows) => {
        const withBooks = await Promise.all(
          rows.map(async (row) => {
            try {
              const book = await api.getBook(row.book_id);
              return {
                bookId: row.book_id,
                title: book.title,
                level: book.level,
                pageCount: book.pages.length,
                currentPageIndex: row.current_page_index,
                completed: row.completed,
                quizCorrect: row.quiz_correct,
                quizTotal: row.quiz_total,
              };
            } catch {
              return null;
            }
          })
        );
        if (!cancelled) setProgress(withBooks.filter((b): b is BookProgressRow => b !== null));
      })
      .catch(() => {
        if (!cancelled) setProgress([]);
      });
    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-3xl border-4 border-white bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{profile.avatar_emoji}</span>
        <div className="flex-1">
          <p className="text-lg font-extrabold text-stone-800">{profile.name}</p>
          <p className="font-body text-sm text-stone-500">
            {profile.cefr_level ? `Level ${profile.cefr_level}` : "No level set"}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onActivate}
          className="rounded-2xl bg-sky-500 px-4 py-2 font-body text-sm font-extrabold text-white shadow-sm hover:bg-sky-600"
        >
          Read as {profile.name}
        </motion.button>
        <button
          onClick={onDelete}
          aria-label={`Remove ${profile.name}`}
          className="shrink-0 rounded-full bg-stone-100 px-3 py-2 font-bold text-stone-400 hover:bg-rose-100 hover:text-rose-500"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 border-t border-stone-100 pt-3">
        <p className="mb-2 font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
          Reading progress
        </p>
        {progress === null && <p className="font-body text-xs text-stone-400">Loading…</p>}
        {progress?.length === 0 && (
          <p className="font-body text-xs text-stone-400">No books started yet.</p>
        )}
        {progress && progress.length > 0 && (
          <ul className="space-y-1.5">
            {progress.map((p) => (
              <li key={p.bookId} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <LevelBadge level={p.level} />
                  <span className="truncate font-body text-sm text-stone-700">{p.title}</span>
                </div>
                <span
                  className={`shrink-0 font-body text-xs font-extrabold ${
                    p.completed ? "text-emerald-600" : "text-stone-400"
                  }`}
                >
                  {p.completed ? "Finished 🎉" : `Page ${p.currentPageIndex + 1} of ${p.pageCount}`}
                  {p.quizTotal != null && ` · Quiz: ${p.quizCorrect}/${p.quizTotal} ⭐`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const { setActiveProfileId } = useActiveProfile();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ChildProfile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(AVATAR_CHOICES[0]);
  // Children start from A1 by default - a parent can still bump an older
  // or more advanced kid up from here.
  const [level, setLevel] = useState<string>("A1");

  useEffect(() => {
    if (!user) return;
    listProfiles()
      .then(setProfiles)
      .catch((e) => setError(String(e)));
  }, [user]);

  if (loading) return <p className="p-10 text-center font-body text-stone-400">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await createProfile(name.trim(), emoji, level || null);
      setProfiles((prev) => [...(prev ?? []), created]);
      setName("");
      setEmoji(AVATAR_CHOICES[0]);
      setLevel("A1");
      setShowAddForm(false);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProfile(id);
      setProfiles((prev) => (prev ?? []).filter((p) => p.id !== id));
    } catch (e) {
      setError(String(e));
    }
  }

  function handleActivate(profile: ChildProfile) {
    setActiveProfileId(profile.id);
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4 rounded-3xl border-4 border-white bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-2xl">
          🧑
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
            Parent / Teacher account
          </p>
          <p className="truncate text-lg font-extrabold text-stone-800">{user.email}</p>
        </div>
        <button
          onClick={() => signOut().then(() => navigate("/login"))}
          className="shrink-0 font-body text-sm font-bold text-stone-400 hover:text-stone-600"
        >
          Sign out
        </button>
      </div>

      <h1 className="mb-4 text-2xl font-extrabold text-stone-800">Your Children</h1>

      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 p-3 text-center font-body text-sm text-rose-600">{error}</p>
      )}

      {profiles === null && <p className="font-body text-stone-400">Loading profiles…</p>}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {profiles?.map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              onActivate={() => handleActivate(p)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {profiles?.length === 0 && !showAddForm && (
        <p className="mt-4 rounded-2xl bg-white p-6 text-center font-body text-stone-500 shadow-sm">
          No child profiles yet. Add one to start tracking reading progress.
        </p>
      )}

      {showAddForm ? (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="mt-4 flex flex-col gap-3 rounded-3xl border-4 border-white bg-white p-5 shadow-sm"
        >
          <input
            autoFocus
            required
            placeholder="Child's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border-2 border-stone-200 px-4 py-3 font-body text-stone-700 outline-none focus:border-sky-400"
          />
          <div className="flex flex-wrap gap-2">
            {AVATAR_CHOICES.map((choice) => (
              <button
                type="button"
                key={choice}
                onClick={() => setEmoji(choice)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-2xl ${
                  emoji === choice ? "border-sky-400 bg-sky-50" : "border-stone-200"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-2xl border-2 border-stone-200 px-4 py-3 font-body text-stone-700 outline-none focus:border-sky-400"
          >
            <option value="">No level yet</option>
            {LEVEL_ORDER.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex-1 rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow-sm hover:bg-sky-600"
            >
              Add Profile
            </motion.button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-2xl border-2 border-stone-200 px-5 font-body font-bold text-stone-500 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full rounded-2xl border-4 border-dashed border-stone-300 py-4 font-body font-bold text-stone-500 hover:border-sky-400 hover:text-sky-600"
        >
          + Add a child profile
        </motion.button>
      )}

      <Link
        to="/"
        className="mt-8 block text-center font-body text-sm font-bold text-sky-600 hover:underline"
      >
        ← Back to books
      </Link>
    </div>
  );
}
