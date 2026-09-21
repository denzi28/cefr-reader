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

### Illustrations: AI-generated art, with a vector fallback

Each of the 4 sample books ships with real AI-generated illustrations
(`server/src/data/images/<bookId>/`, referenced by `imageUrl`/
`coverImageUrl` in the book JSON) — that's what the app shows by default.

Every page *also* has a vector "scene" description underneath (a list of
small SVG sprites like sun, dog, tree, house, ball, and where to place
them — `server/src/data/books/*.json` → `scene`, drawn by
`client/src/illustrations/`). The client (`client/src/components/PageArt.tsx`)
shows the real image when `imageUrl` is present and falls back to
rendering the vector scene otherwise. This means:

- A brand-new book with no generated art yet still displays something
  reasonable immediately — no image pipeline is required to add a book.
- The same vector scene data could be rendered natively on a future
  mobile app without needing to ship/generate images for it too.

## Generating AI illustrations

- `server/scripts/art-prompts/*.json` — one file per book with a shared
  style description, a character reference (so the same characters look
  consistent across pages), and one scene prompt per page/cover, written
  to match a warm, painterly children's-book illustration style.
- `server/scripts/generate-images.mjs` — calls Google's Gemini image
  model (`gemini-3.1-flash-image`) for each prompt, resizes/recompresses
  the result with `sharp` (the raw output is several MB per image; this
  gets the library down to a web-friendly size with no visible quality
  loss), saves the JPEGs into `server/src/data/images/<bookId>/`, and
  patches the matching `server/src/data/books/<bookId>.json` to point at
  them.

To run it:

```bash
cd server
export GEMINI_API_KEY=...         # from https://aistudio.google.com/apikey
npm run generate:images           # all books
npm run generate:images -- --only the-red-ball   # just one book
npm run generate:images -- --force               # regenerate existing images too
```

**This needs a billing-enabled Google Cloud project**, not just an API
key — Gemini's free tier has zero quota for image generation. Actual
usage cost is small (roughly $0.05–$0.15 per image at the time of
writing; generating this repo's 26 images cost a few dollars total), but
a payment method must be on the project. Restart the API server
afterward; the client picks up the new images automatically.

**Using a different provider** (OpenAI, Stability AI, Replicate, etc.)
only requires rewriting the `generateImage()` function at the top of
`generate-images.mjs` — the prompt loading, resizing, file writing, and
JSON patching are provider-agnostic. To add a new book's worth of art,
write a matching `server/scripts/art-prompts/<id>.json` file first.

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
- **AI-generated story text**: a script that prompts an LLM for a new,
  level-appropriate story plus matching `art-prompts/<id>.json` entries,
  then writes out a new book JSON file in the same format used here.
- **Native mobile app** reusing the same `server` API (React Native with
  `react-native-svg` could reuse the same scene-description approach).
