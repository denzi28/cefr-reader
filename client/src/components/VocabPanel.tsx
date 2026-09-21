import type { VocabEntry } from "../types/book";

export function VocabPanel({ entry, onClose }: { entry: VocabEntry | null; onClose: () => void }) {
  if (!entry) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 sm:pb-6">
      <div className="w-full max-w-xl rounded-3xl border-4 border-amber-300 bg-white shadow-xl p-5 flex items-start gap-4 animate-in slide-in-from-bottom-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl">
          📖
        </div>
        <div className="flex-1">
          <p className="text-lg font-extrabold capitalize text-amber-700">{entry.word}</p>
          <p className="font-body text-base text-stone-700">{entry.definition}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
