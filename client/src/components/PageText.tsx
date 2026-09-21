import type { VocabEntry } from "../types/book";

// Splits page text on {{word}} tokens and renders vocabulary words as
// tappable buttons. Tapping a word calls onWordTap with its glossary entry.
export function PageText({
  text,
  vocab,
  onWordTap,
  activeWord,
}: {
  text: string;
  vocab: VocabEntry[];
  onWordTap: (entry: VocabEntry) => void;
  activeWord?: string;
}) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);

  return (
    <p className="font-body text-2xl sm:text-3xl leading-relaxed text-stone-800">
      {parts.map((part, i) => {
        const match = part.match(/^\{\{([^}]+)\}\}$/);
        if (!match) return <span key={i}>{part}</span>;
        const word = match[1];
        const entry = vocab.find((v) => v.word.toLowerCase() === word.toLowerCase());
        const isActive = activeWord?.toLowerCase() === word.toLowerCase();
        return (
          <button
            key={i}
            type="button"
            onClick={() => entry && onWordTap(entry)}
            className={`inline font-bold underline decoration-dashed decoration-2 underline-offset-4 rounded px-0.5 transition-colors ${
              isActive
                ? "bg-amber-200 text-amber-900 decoration-amber-600"
                : "text-sky-700 decoration-sky-400 hover:bg-sky-100"
            }`}
          >
            {word}
          </button>
        );
      })}
    </p>
  );
}
