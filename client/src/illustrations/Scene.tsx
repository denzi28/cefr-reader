import type { Scene as SceneData } from "../types/book";
import { SPRITES } from "./sprites";

const BACKGROUNDS: Record<SceneData["background"], { sky: [string, string]; ground?: string }> = {
  day: { sky: ["#BEE3F8", "#EAF6FF"], ground: "#CFF3D6" },
  park: { sky: ["#BEE3F8", "#EAF6FF"], ground: "#B7E4B0" },
  indoor: { sky: ["#FFF3DC", "#FFF9EC"], ground: "#F1DDBE" },
  night: { sky: ["#2A3466", "#1B2140"], ground: "#38406B" },
  mystery: { sky: ["#C9C2E6", "#E7E2F7"], ground: "#B9AEDD" },
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
        <rect x="0" y={VIEW_H * 0.78} width={VIEW_W} height={VIEW_H * 0.22} fill={bg.ground} />
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
