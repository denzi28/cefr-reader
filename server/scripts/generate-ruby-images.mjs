#!/usr/bin/env node
// One-off generator for ruby-picnic-basket: its page 4 is an interactive
// task widget with no photo, so images map to pages 1,2,3,5,6 rather than
// the shared generate-images.mjs script's assumed 1-2-3-4-5 sequence.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "src", "data", "images", "ruby-picnic-basket");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-image";

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
  await readFile(path.join(__dirname, "art-prompts", "ruby-picnic-basket.json"), "utf-8")
);
const fullPrompt = (scene) => `${prompts.style}\n\nCharacters: ${prompts.characters}\n\nScene: ${scene}`;

await mkdir(IMAGES_DIR, { recursive: true });

const targets = [
  { file: "cover.jpg", scene: prompts.cover },
  { file: "page-1.jpg", scene: prompts.pages[0] },
  { file: "page-2.jpg", scene: prompts.pages[1] },
  { file: "page-3.jpg", scene: prompts.pages[2] },
  { file: "page-5.jpg", scene: prompts.pages[3] },
  { file: "page-6.jpg", scene: prompts.pages[4] },
];

for (const { file, scene } of targets) {
  console.log(`generating ${file}...`);
  const buffer = await generateImage(fullPrompt(scene));
  await writeFile(path.join(IMAGES_DIR, file), buffer);
}
console.log("done");
