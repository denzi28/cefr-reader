import type { CEFRLevel } from "../types/book";

const COLORS: Record<CEFRLevel, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-300",
  A2: "bg-teal-100 text-teal-700 border-teal-300",
  B1: "bg-sky-100 text-sky-700 border-sky-300",
  B2: "bg-indigo-100 text-indigo-700 border-indigo-300",
  C1: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  C2: "bg-rose-100 text-rose-700 border-rose-300",
};

export function LevelBadge({ level }: { level: CEFRLevel }) {
  return (
    <span className={`inline-block rounded-full border-2 px-3 py-0.5 text-sm font-extrabold ${COLORS[level]}`}>
      {level}
    </span>
  );
}
