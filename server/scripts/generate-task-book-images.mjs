#!/usr/bin/env node
// Generic generator for TBL books whose task-stop page has no photo (an
// interactive widget, not a scene) - so images map to a `pageMap` array
// in the art-prompts file (target page numbers) rather than the shared
// generate-images.mjs script's assumed 1-2-3-4-5-... sequence.
//
// Usage: GEMINI_API_KEY=... node scripts/generate-task-book-images.mjs <bookId>
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bookId = process.argv[2];
if (!bookId) {
  console.error("Usage: node scripts/generate-task-book-images.mjs <bookId>");
  process.exit(1);
}

const IMAGES_DIR = path.join(__dirname, "..", "src", "data", "images", bookId);
// Lite tier by default to save cost; pass GEMINI_MODEL=gemini-3.1-flash-image
// for a one-off when a book needs the full model's extra fidelity.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-image";

async function generateImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "4:3" } },
      }),
    }
  );
  if (!res.ok) throw new Error(`Image API request failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  const imagePart = (json.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
  if (!imagePart) throw new Error(`No image data: ${JSON.stringify(json).slice(0, 500)}`);
  const raw = Buffer.from(imagePart.inlineData.data, "base64");
  return sharp(raw).resize({ width: 1000, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
}

const prompts = JSON.parse(
  await readFile(path.join(__dirname, "art-prompts", `${bookId}.json`), "utf-8")
);
if (!prompts.pageMap || prompts.pageMap.length !== prompts.pages.length) {
  console.error(`art-prompts/${bookId}.json needs a "pageMap" array matching "pages" in length.`);
  process.exit(1);
}
const fullPrompt = (scene) => `${prompts.style}\n\nCharacters: ${prompts.characters}\n\nScene: ${scene}`;

await mkdir(IMAGES_DIR, { recursive: true });

const targets = [
  { file: "cover.jpg", scene: prompts.cover },
  ...prompts.pageMap.map((pageNum, i) => ({ file: `page-${pageNum}.jpg`, scene: prompts.pages[i] })),
];

for (const { file, scene } of targets) {
  console.log(`[${bookId}] generating ${file}...`);
  const buffer = await generateImage(fullPrompt(scene));
  await writeFile(path.join(IMAGES_DIR, file), buffer);
}
console.log(`[${bookId}] done`);
