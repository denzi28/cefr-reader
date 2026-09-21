import { Link } from "react-router-dom";
import type { BookSummary } from "../types/book";
import { Scene } from "../illustrations/Scene";
import { LevelBadge } from "./LevelBadge";

export function BookCard({ book }: { book: BookSummary }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border-4 border-white bg-white shadow-md ring-1 ring-stone-200 transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <Scene scene={book.coverScene} className="h-40 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-stone-800 group-hover:text-sky-700">{book.title}</h3>
          <LevelBadge level={book.level} />
        </div>
        <p className="font-body text-sm text-stone-500">{book.summary}</p>
        <p className="mt-auto font-body text-xs font-bold uppercase tracking-wide text-stone-400">
          {book.pageCount} pages
        </p>
      </div>
    </Link>
  );
}
