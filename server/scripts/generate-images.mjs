#!/usr/bin/env node
// Generates AI illustrations for every book page and writes them into
// server/src/data/images/<bookId>/{cover,page-N}.png, then patches the
// matching server/src/data/books/<bookId>.json to add imageUrl fields so
// the app serves the generated art instead of the built-in vector scenes.
//
// Usage:
//   OPENAI_API_KEY=sk-... npm run generate:images
//   OPENAI_API_KEY=sk-... npm run generate:images -- --only the-red-ball
//   OPENAI_API_KEY=sk-... npm run generate:images -- --force   # regenerate existing images too
//
// Requires an OpenAI API key with access to image generation (gpt-image-1).
// To use a different provider (Stability AI, Google Imagen/Gemini, Replicate,
// etc.), only the generateImage() function below needs to change — everything
// else (prompt loading, file writing, JSON patching) is provider-agnostic.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, "art-prompts");
const IMAGES_DIR = path.join(__dirname, "..", "src", "data", "images");
const BOOKS_DIR = path.join(__dirname, "..", "src", "data", "books");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyIndex = args.indexOf("--only");
const ONLY = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

async function generateImage(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set OPENAI_API_KEY to generate images (see server/README section in the repo README)."
    );
  }
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024",
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Image API request failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  const item = json.data?.[0];
  if (item?.b64_json) return Buffer.from(item.b64_json, "base64");
  if (item?.url) {
    const imgRes = await fetch(item.url);
    return Buffer.from(await imgRes.arrayBuffer());
  }
  throw new Error("Image API response had no image data.");
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
  const coverPath = path.join(bookImagesDir, "cover.png");
  if (FORCE || !existsSync(coverPath)) {
    console.log(`[${bookId}] generating cover…`);
    const buf = await generateImage(fullPrompt(prompts.cover));
    await writeFile(coverPath, buf);
  } else {
    console.log(`[${bookId}] cover already exists, skipping (use --force to regenerate)`);
  }
  book.coverImageUrl = `/images/${bookId}/cover.png`;

  // Pages
  for (let i = 0; i < prompts.pages.length; i++) {
    const pageNum = i + 1;
    const pagePath = path.join(bookImagesDir, `page-${pageNum}.png`);
    if (FORCE || !existsSync(pagePath)) {
      console.log(`[${bookId}] generating page ${pageNum}/${prompts.pages.length}…`);
      const buf = await generateImage(fullPrompt(prompts.pages[i]));
      await writeFile(pagePath, buf);
    } else {
      console.log(`[${bookId}] page ${pageNum} already exists, skipping`);
    }
    const page = book.pages.find((p) => p.index === pageNum);
    if (page) page.imageUrl = `/images/${bookId}/page-${pageNum}.png`;
  }

  await writeFile(bookPath, JSON.stringify(book, null, 2) + "\n");
  console.log(`[${bookId}] done — updated ${path.relative(process.cwd(), bookPath)}`);
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
