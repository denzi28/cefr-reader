import type { Book, BookSummary, LevelInfo } from "../types/book";
import { LEVEL_META, LEVEL_ORDER } from "../data/levelMeta";

// This build reads the book library from a single static JSON file
// (public/data/books.json, generated from server/src/data/books/*.json)
// rather than hitting the Express API, so the whole app can be hosted as
// a static site with no backend to deploy or keep warm. The `server/`
// package remains the source of truth for book content and is what a
// future dynamic feature (progress tracking, user accounts, a mobile
// client) would talk to instead.
let booksPromise: Promise<Book[]> | null = null;

function loadBooks(): Promise<Book[]> {
  if (!booksPromise) {
    booksPromise = fetch("/data/books.json").then((res) => {
      if (!res.ok) throw new Error(`Failed to load book data: ${res.status}`);
      return res.json() as Promise<Book[]>;
    });
  }
  return booksPromise;
}

function toSummary(book: Book): BookSummary {
  return {
    id: book.id,
    title: book.title,
    level: book.level,
    summary: book.summary,
    coverScene: book.coverScene,
    coverImageUrl: book.coverImageUrl,
    pageCount: book.pages.length,
  };
}

export const api = {
  async getLevels(): Promise<LevelInfo[]> {
    const books = await loadBooks();
    return LEVEL_ORDER.map((level) => ({
      level,
      label: LEVEL_META[level].label,
      description: LEVEL_META[level].description,
      bookCount: books.filter((b) => b.level === level).length,
    }));
  },

  async getBooks(level?: string): Promise<BookSummary[]> {
    const books = await loadBooks();
    const filtered = level ? books.filter((b) => b.level === level) : books;
    return filtered.map(toSummary);
  },

  async getBook(id: string): Promise<Book> {
    const books = await loadBooks();
    const book = books.find((b) => b.id === id);
    if (!book) throw new Error(`Book not found: ${id}`);
    return book;
  },
};

// Book/page `imageUrl`s (e.g. "/images/the-red-ball/page-1.jpg") are served
// from this same static site, so no base URL rewriting is needed.
export function resolveAssetUrl(url: string): string {
  return url;
}
