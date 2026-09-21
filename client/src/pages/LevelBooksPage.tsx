import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { BookSummary, CEFRLevel } from "../types/book";
import { BookCard } from "../components/BookCard";
import { LevelBadge } from "../components/LevelBadge";

export function LevelBooksPage() {
  const { level } = useParams<{ level: string }>();
  const [books, setBooks] = useState<BookSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!level) return;
    setBooks(null);
    api
      .getBooks(level)
      .then(setBooks)
      .catch((e) => setError(String(e)));
  }, [level]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="font-body text-sm font-bold text-sky-600 hover:underline">
        ← All levels
      </Link>

      <header className="my-6 flex items-center gap-3">
        {level && <LevelBadge level={level as CEFRLevel} />}
        <h1 className="text-3xl font-extrabold text-stone-800">Books</h1>
      </header>

      {error && (
        <p className="rounded-xl bg-rose-50 p-4 text-center font-body text-rose-600">
          Couldn't load books: {error}.
        </p>
      )}

      {!books && !error && <p className="font-body text-stone-400">Loading books…</p>}

      {books && books.length === 0 && (
        <p className="rounded-2xl bg-white p-8 text-center font-body text-stone-500 shadow-sm">
          No books at this level yet. More stories are on the way!
        </p>
      )}

      {books && books.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
