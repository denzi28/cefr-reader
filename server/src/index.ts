import express from "express";
import cors from "cors";
import { BOOKS } from "./data/books.js";
import { LEVEL_META, LEVEL_ORDER } from "./data/levels.js";
import type { Book, BookSummary, LevelInfo } from "./types.js";

const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors());
app.use(express.json());

function toSummary(book: Book): BookSummary {
  return {
    id: book.id,
    title: book.title,
    level: book.level,
    summary: book.summary,
    coverScene: book.coverScene,
    pageCount: book.pages.length,
  };
}

// GET /api/levels — CEFR levels with how many books exist for each.
app.get("/api/levels", (_req, res) => {
  const levels: LevelInfo[] = LEVEL_ORDER.map((level) => ({
    level,
    label: LEVEL_META[level].label,
    description: LEVEL_META[level].description,
    bookCount: BOOKS.filter((b) => b.level === level).length,
  }));
  res.json(levels);
});

// GET /api/books?level=A1 — list books, optionally filtered by CEFR level.
app.get("/api/books", (req, res) => {
  const level = req.query.level as string | undefined;
  const filtered = level ? BOOKS.filter((b) => b.level === level) : BOOKS;
  res.json(filtered.map(toSummary));
});

// GET /api/books/:id — full book with all pages, text, scenes, and vocab.
app.get("/api/books/:id", (req, res) => {
  const book = BOOKS.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, bookCount: BOOKS.length });
});

app.listen(PORT, () => {
  console.log(`CEFR reader API listening on http://localhost:${PORT}`);
});
