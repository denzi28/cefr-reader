#!/usr/bin/env node
// Generates AI illustrations for every book page and writes them into
// server/src/data/images/<bookId>/{cover,page-N}.png, then patches the
// matching server/src/data/books/<bookId>.json to add imageUrl fields so
// the app serves the generated art instead of the built-in vector scenes.
//
// Usage:
//   GEMINI_API_KEY=... npm run generate:images
//   GEMINI_API_KEY=... npm run generate:images -- --only the-red-ball
//   GEMINI_API_KEY=... npm run generate:images -- --force   # regenerate existing images too
//
// Requires a Google AI Studio API key (https://aistudio.google.com/apikey)
// with access to Gemini's image-generation model. Set GEMINI_API_KEY or
// GOOGLE_API_KEY (either name works). To use a different provider (OpenAI,
// Stability AI, Replicate, etc.), only the generateImage() function below
// needs to change - everything else (prompt loading, file writing, JSON
// patching) is provider-agnostic.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, "art-prompts");
const IMAGES_DIR = path.join(__dirname, "..", "src", "data", "images");
const BOOKS_DIR = path.join(__dirname, "..", "src", "data", "books");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyIndex = args.indexOf("--only");
const ONLY = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

// gemini-2.5-flash-image is being retired by Google on 2026-10-02.
// Using the "lite" tier of its replacement (~half the cost of plain
// gemini-3.1-flash-image) since book illustrations don't need the
// non-lite tier's extra fidelity. Pass --model to override per-run,
// e.g. when a scene needs the higher-fidelity model.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-image";

async function generateImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set GEMINI_API_KEY (or GOOGLE_API_KEY) to generate images - get one at https://aistudio.google.com/apikey. See the repo README for details."
    );
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: { aspectRatio: "4:3" },
        },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Image API request failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(
      `Image API response had no image data: ${JSON.stringify(json).slice(0, 500)}`
    );
  }
  const raw = Buffer.from(imagePart.inlineData.data, "base64");

  // The API returns full-resolution images (multiple MB each) - far larger
  // than they'll ever be displayed at in the app. Re-encode to a sensible
  // web size so the book data folder (and page load times) stay small;
  // this cut the sample library from ~24MB to ~3MB with no visible
  // quality loss at the sizes the reader actually renders images at.
  const buffer = await sharp(raw)
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  return { buffer, ext: "jpg" };
}

// Finds an already-generated file for `baseName` regardless of which
// extension it was saved with (jpg vs png), so re-runs don't re-pay for
// images that exist under a different extension than the current default.
function findExisting(dir, baseName) {
  for (const ext of ["jpg", "png"]) {
    const p = path.join(dir, `${baseName}.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

async function generateBook(bookId) {
  const promptPath = path.join(PROMPTS_DIR, `${bookId}.json`);
  const bookPath = path.join(BOOKS_DIR, `${bookId}.json`);
  const prompts = JSON.parse(await readFile(promptPath, "utf-8"));
  const book = JSON.parse(await readFile(bookPath, "utf-8"));
  const bookImagesDir = path.join(IMAGES_DIR, bookId);
  await mkdir(bookImagesDir, { recursive: true });

  const fullPrompt = (scene) => `${prompts.style}\n\nCharacters: ${prompts.characters}\n\nScene: ${scene}`;

  // Cover
  let coverFile = findExisting(bookImagesDir, "cover");
  if (FORCE || !coverFile) {
    console.log(`[${bookId}] generating cover…`);
    const { buffer, ext } = await generateImage(fullPrompt(prompts.cover));
    coverFile = path.join(bookImagesDir, `cover.${ext}`);
    await writeFile(coverFile, buffer);
  } else {
    console.log(`[${bookId}] cover already exists, skipping (use --force to regenerate)`);
  }
  book.coverImageUrl = `/images/${bookId}/${path.basename(coverFile)}`;

  // Pages
  for (let i = 0; i < prompts.pages.length; i++) {
    const pageNum = i + 1;
    let pageFile = findExisting(bookImagesDir, `page-${pageNum}`);
    if (FORCE || !pageFile) {
      console.log(`[${bookId}] generating page ${pageNum}/${prompts.pages.length}…`);
      const { buffer, ext } = await generateImage(fullPrompt(prompts.pages[i]));
      pageFile = path.join(bookImagesDir, `page-${pageNum}.${ext}`);
      await writeFile(pageFile, buffer);
    } else {
      console.log(`[${bookId}] page ${pageNum} already exists, skipping`);
    }
    const page = book.pages.find((p) => p.index === pageNum);
    if (page) page.imageUrl = `/images/${bookId}/${path.basename(pageFile)}`;
  }

  await writeFile(bookPath, JSON.stringify(book, null, 2) + "\n");
  console.log(`[${bookId}] done - updated ${path.relative(process.cwd(), bookPath)}`);
}

async function main() {
  const { readdir } = await import("node:fs/promises");
  const bookIds = (await readdir(PROMPTS_DIR))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((id) => !ONLY || id === ONLY);

  if (bookIds.length === 0) {
    console.error(ONLY ? `No prompt file found for "${ONLY}".` : "No prompt files found.");
    process.exit(1);
  }

  for (const bookId of bookIds) {
    await generateBook(bookId);
  }
  console.log("\nAll done. Restart the API server (npm run dev) to serve the new images.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
