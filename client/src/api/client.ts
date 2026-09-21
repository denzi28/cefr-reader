import type { Book, BookSummary, LevelInfo } from "../types/book";

// In dev, Vite proxies /api to the Express server (see vite.config.ts).
// In production, set VITE_API_BASE_URL to point at the deployed API.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getLevels: () => getJson<LevelInfo[]>("/api/levels"),
  getBooks: (level?: string) =>
    getJson<BookSummary[]>(`/api/books${level ? `?level=${level}` : ""}`),
  getBook: (id: string) => getJson<Book>(`/api/books/${id}`),
};
