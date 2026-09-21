import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { LevelInfo } from "../types/book";
import { LevelBadge } from "../components/LevelBadge";

export function LevelsPage() {
  const [levels, setLevels] = useState<LevelInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getLevels().then(setLevels).catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-stone-800 sm:text-5xl">
          🐣 Story Levels
        </h1>
        <p className="mt-3 font-body text-lg text-stone-500">
          Pick a level to find picture books just right for you, from CEFR A1 to C2.
        </p>
      </header>

      {error && (
        <p className="rounded-xl bg-rose-50 p-4 text-center font-body text-rose-600">
          Couldn't load levels: {error}. Is the API server running?
        </p>
      )}

      {!levels && !error && (
        <p className="text-center font-body text-stone-400">Loading levels…</p>
      )}

      {levels && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((lvl) => (
            <Link
              key={lvl.level}
              to={`/levels/${lvl.level}`}
              className={`flex flex-col gap-3 rounded-3xl border-4 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg ${
                lvl.bookCount === 0 ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <LevelBadge level={lvl.level} />
                <span className="font-body text-sm font-bold text-stone-400">
                  {lvl.bookCount} {lvl.bookCount === 1 ? "book" : "books"}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-stone-800">{lvl.label}</h2>
              <p className="font-body text-sm text-stone-500">{lvl.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
