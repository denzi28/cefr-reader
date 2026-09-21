# CEFR Story Books for Kids

A web app of illustrated, level-graded storybooks for children learning
English, organized by [CEFR level](https://www.coe.int/en/web/common-european-framework-reference-languages) (A1–C2).
Kids browse by level, read a book page by page with a picture on every
page, and tap any underlined word to see a simple definition.

## How it's built

- **`server/`** — Express + TypeScript API that serves book data as JSON
  (levels, book lists, full book contents with pages and vocabulary).
  Built as a separate API so a future mobile app can reuse it as-is.
- **`client/`** — React + TypeScript + Vite + Tailwind web app that
  consumes the API: a levels page, a per-level book list, and a page-by-page
  reader with a tap-to-define vocabulary helper.

### Why vector illustrations instead of generated images

Each page's picture is described as **data**, not a picture file: a page
just lists which small vector "sprites" (sun, dog, tree, house, ball, …)
to place and where (`server/src/data/books/*.json` → `scene`). The client
(`client/src/illustrations/`) draws these as SVG. This means:

- The app works immediately with no image-generation API key.
- New books can be authored (by a person, or later by an LLM) as plain
  JSON with a list of sprite placements — no image pipeline needed.
- The same scene data could be rendered natively on a future mobile app.

If you'd rather use real illustrated/AI-generated artwork per page, add an
`imageUrl` field to a page in the book JSON and have the client render an
`<img>` when it's present, falling back to the vector `Scene` otherwise.

## Getting started

Requires Node.js 20+.

```bash
# Terminal 1 — API server (http://localhost:4000)
cd server
npm install
npm run dev

# Terminal 2 — web client (http://localhost:5173)
cd client
npm install
npm run dev
```

Open http://localhost:5173. The client dev server proxies `/api` to
`http://localhost:4000` (see `client/vite.config.ts`), so no extra config
is needed locally.

### Production build

```bash
cd server && npm run build && npm start   # serves API on PORT (default 4000)
cd client && npm run build                # outputs static site to client/dist
```

For a deployed client talking to a separately-hosted API, set
`VITE_API_BASE_URL` (e.g. in a `.env` file in `client/`) to the API's URL.

## Content model

Books live in `server/src/data/books/*.json`. Each book has:

- `level`: one of `A1`, `A2`, `B1`, `B2`, `C1`, `C2`
- `pages[]`: each with `text` (vocabulary words wrapped like `{{word}}`),
  a `scene` (background + sprite placements), and `vocab[]` (word →
  child-friendly definition) for the words used on that page

The app ships with 4 sample books (2×A1, 1×A2, 1×B1) to demonstrate the
full experience. B2–C2 currently show "no books yet" — add books at those
levels the same way to fill them in.

## Adding a new book

1. Create `server/src/data/books/<id>.json` following the shape in
   `server/src/types.ts` (`Book`).
2. Register it in `server/src/data/books.ts` (import + add to `BOOKS`).
3. Use only sprite names that exist in `client/src/illustrations/sprites.tsx`,
   or add new sprites there first.

## Roadmap ideas

Not built yet, but the architecture leaves room for:

- **Progress tracking / child profiles** — which books were read, per level.
- **Simple comprehension quizzes** after each book.
- **AI-generated books**: a script that prompts an LLM for level-appropriate
  story text and a matching list of scene/sprite placements, then writes
  out a new book JSON file in the same format used here.
- **Native mobile app** reusing the same `server` API (React Native with
  `react-native-svg` could reuse the same scene-description approach).
