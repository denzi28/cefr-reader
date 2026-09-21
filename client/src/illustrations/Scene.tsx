import type { Scene as SceneData } from "../types/book";
import { SPRITES } from "./sprites";

const BACKGROUNDS: Record<
  SceneData["background"],
  { sky: [string, string]; ground?: string; groundLine?: string }
> = {
  day: { sky: ["#4FC3F7", "#8FE0FB"], ground: "#7ED957", groundLine: "#4CAF50" },
  park: { sky: ["#4FC3F7", "#8FE0FB"], ground: "#6FCB4D", groundLine: "#43A047" },
  indoor: { sky: ["#FFD873", "#FFE9A8"], ground: "#E3A85C", groundLine: "#B5763B" },
  night: { sky: ["#161B4D", "#2A3494"], ground: "#2E3B78", groundLine: "#1F2A5C" },
  mystery: { sky: ["#7C6FD1", "#B0A3EE"], ground: "#6C5FBE", groundLine: "#4E4291" },
};

const VIEW_W = 400;
const VIEW_H = 240;

export function Scene({ scene, className }: { scene: SceneData; className?: string }) {
  const bg = BACKGROUNDS[scene.background];
  const isNight = scene.background === "night";
  const gradientId = `sky-${scene.background}`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      role="img"
      aria-label="Story illustration"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg.sky[0]} />
          <stop offset="100%" stopColor={bg.sky[1]} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#${gradientId})`} />
      {isNight &&
        [...Array(12)].map((_, i) => (
          <circle
            key={i}
            cx={(i * 37 + 20) % VIEW_W}
            cy={(i * 53 + 10) % 90}
            r={1.4}
            fill="#FFFFFF"
            opacity={0.8}
          />
        ))}
      {bg.ground && (
        <>
          <rect x="0" y={VIEW_H * 0.78} width={VIEW_W} height={VIEW_H * 0.22} fill={bg.ground} />
          <rect x="0" y={VIEW_H * 0.78} width={VIEW_W} height={2.5} fill={bg.groundLine} />
        </>
      )}
      {scene.items.map((item, i) => {
        const Sprite = SPRITES[item.sprite];
        if (!Sprite) return null;
        const x = (item.x / 100) * VIEW_W;
        const y = (item.y / 100) * VIEW_H;
        const scale = (item.scale ?? 1) * (item.flip ? -1 : 1);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${scale} ${item.scale ?? 1})`}>
            <Sprite />
          </g>
        );
      })}
    </svg>
  );
}
