// A small library of flat, colorful vector "sprites" used to compose each
// page's illustration. Books describe a scene as a list of {sprite, x, y}
// placements (see types/book.ts); this file is the only place that knows
// how to actually draw each sprite. Keeping illustrations as vector data
// (rather than raster images) means new AI-generated books can ship as
// plain JSON scene descriptions with no image-generation step required,
// and the same data can later be rendered natively on mobile too.

import type { JSX } from "react";

// A dark, consistent "ink" outline on every shape is what makes these read
// as bold flat-cartoon stickers rather than soft, pale watercolor blobs.
// Setting it once on each sprite's outer <g> lets every filled child shape
// inherit it; individual shapes opt out with stroke="none" where an outline
// would be wrong (e.g. thin detail lines that are already a solid color).
const INK = "#2b2320";
const OUTLINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Every sprite is drawn centered on (0,0) within roughly a 40x40 box,
// so callers can position it with a simple translate + scale.
export const SPRITES: Record<string, () => JSX.Element> = {
  Sun: () => (
    <g {...OUTLINE}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = Math.cos(angle) * 17, y1 = Math.sin(angle) * 17;
        const x2 = Math.cos(angle) * 25, y2 = Math.sin(angle) * 25;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round" />;
      })}
      <circle r="15" fill="#FFC738" />
    </g>
  ),
  Moon: () => (
    <g {...OUTLINE}>
      <path d="M11,-16 A16,16 0 1 0 11,16 A12,12 0 1 1 11,-16 Z" fill="#FFD666" />
    </g>
  ),
  Cloud: () => (
    <g {...OUTLINE} fill="#FFFFFF">
      <ellipse cx="-10" cy="4" rx="12" ry="9" />
      <ellipse cx="8" cy="0" rx="16" ry="12" />
      <ellipse cx="22" cy="6" rx="10" ry="7" />
    </g>
  ),
  Star: () => (
    <path
      d="M0,-14 L3.5,-4 L14,-4 L5.5,2.5 L8.5,13 L0,6.5 L-8.5,13 L-5.5,2.5 L-14,-4 L-3.5,-4 Z"
      fill="#FFDD33"
      {...OUTLINE}
      strokeWidth={2.5}
    />
  ),
  Tree: () => (
    <g {...OUTLINE}>
      <rect x="-4" y="6" width="8" height="20" rx="2" fill="#A9662E" />
      <circle cx="0" cy="-8" r="20" fill="#2F9E44" />
      <circle cx="-13" cy="3" r="12.5" fill="#37B24D" />
      <circle cx="13" cy="3" r="12.5" fill="#37B24D" />
    </g>
  ),
  Flower: () => (
    <g {...OUTLINE}>
      <rect x="-1.5" y="4" width="3" height="16" fill="#37B24D" strokeWidth={2} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx={0}
          cy={-8}
          rx="5.5"
          ry="8.5"
          fill="#FF6FA5"
          transform={`rotate(${deg} 0 -8)`}
        />
      ))}
      <circle cx="0" cy="-8" r="4.5" fill="#FFC738" />
    </g>
  ),
  Fence: () => (
    <g {...OUTLINE} fill="#E3A85C">
      <rect x="-24" y="-2" width="48" height="5" />
      {[-20, -8, 4, 16].map((x) => (
        <rect key={x} x={x} y="-14" width="6" height="24" rx="1" />
      ))}
    </g>
  ),
  Bench: () => (
    <g {...OUTLINE} fill="#B5763B">
      <rect x="-20" y="-4" width="40" height="5" rx="1" />
      <rect x="-20" y="6" width="40" height="5" rx="1" />
      <rect x="-18" y="-4" width="4" height="18" />
      <rect x="14" y="-4" width="4" height="18" />
    </g>
  ),
  House: () => (
    <g {...OUTLINE}>
      <rect x="-20" y="-2" width="40" height="26" fill="#FFCE7A" />
      <path d="M-25,-2 L0,-23 L25,-2 Z" fill="#E8542E" />
      <rect x="-6" y="8" width="12" height="16" fill="#8B4A26" />
      <rect x="10" y="4" width="8" height="8" fill="#5DC3E8" />
    </g>
  ),
  Window: () => (
    <g {...OUTLINE}>
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#5DC3E8" />
      <line x1="0" y1="-12" x2="0" y2="12" strokeWidth={2.5} />
      <line x1="-12" y1="0" x2="12" y2="0" strokeWidth={2.5} />
    </g>
  ),
  Table: () => (
    <g {...OUTLINE} fill="#C1863F">
      <rect x="-18" y="-4" width="36" height="6" rx="1" />
      <rect x="-14" y="2" width="4" height="16" />
      <rect x="10" y="2" width="4" height="16" />
    </g>
  ),
  Lamp: () => (
    <g {...OUTLINE}>
      <rect x="-2" y="0" width="4" height="20" fill="#B5763B" />
      <path d="M-10,-14 L10,-14 L6,0 L-6,0 Z" fill="#FFD666" />
    </g>
  ),
  Book: () => (
    <g {...OUTLINE}>
      <rect x="-12" y="-9" width="24" height="18" rx="2" fill="#3D8BFF" />
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#FFFFFF" strokeWidth="2.5" />
    </g>
  ),
  Bag: () => (
    <g {...OUTLINE}>
      <path d="M-9,-6 L9,-6 L11,14 L-11,14 Z" fill="#E8542E" />
      <path d="M-5,-6 C-5,-14 5,-14 5,-6" fill="none" strokeWidth={3} />
    </g>
  ),
  Dog: () => (
    <g {...OUTLINE}>
      <path d="M-16,4 Q-25,-3 -18,-9" fill="none" strokeWidth={5} stroke="#C1813F" />
      <rect x="-18" y="10" width="6" height="9" rx="2" fill="#9A5F27" />
      <rect x="10" y="10" width="6" height="9" rx="2" fill="#9A5F27" />
      <ellipse cx="0" cy="6" rx="16" ry="10" fill="#C1813F" />
      <circle cx="14" cy="-4" r="10" fill="#C1813F" />
      <path d="M20,-11 L29,-19 L22,-4 Z" fill="#9A5F27" />
      <path d="M8,-11 L2,-19 L10,-4 Z" fill="#9A5F27" />
      <ellipse cx="24" cy="-1" rx="3" ry="2.2" fill="#2b2320" stroke="none" />
      <circle cx="17" cy="-5" r="1.8" fill="#2b2320" stroke="none" />
    </g>
  ),
  Cat: () => (
    <g {...OUTLINE}>
      <path d="M-14,4 Q-23,-5 -14,-11" fill="none" strokeWidth={5} stroke="#E8935A" />
      <ellipse cx="0" cy="6" rx="14" ry="9" fill="#E8935A" />
      <circle cx="12" cy="-5" r="9" fill="#E8935A" />
      <path d="M6,-12 L9,-21 L14,-11 Z" fill="#E8935A" />
      <path d="M18,-12 L15,-21 L22,-11 Z" fill="#E8935A" />
      <circle cx="14" cy="-6" r="1.6" fill="#2b2320" stroke="none" />
      <circle cx="9" cy="-6" r="1.6" fill="#2b2320" stroke="none" />
    </g>
  ),
  Ball: () => (
    <g {...OUTLINE}>
      <circle r="12" fill="#F03E3E" />
      <path d="M-12,0 A12,12 0 0 0 12,0" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M0,-12 A12,12 0 0 0 0,12" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
    </g>
  ),
  Magnifier: () => (
    <g {...OUTLINE} fill="none">
      <circle cx="-3" cy="-3" r="11" fill="#BFE3FA" />
      <line x1="6" y1="6" x2="16" y2="16" strokeWidth={4.5} />
    </g>
  ),
  Girl: () => (
    <g {...OUTLINE}>
      <rect x="-11" y="4" width="6" height="14" rx="2" fill="#F4B183" />
      <rect x="5" y="4" width="6" height="14" rx="2" fill="#F4B183" />
      <path d="M-9,-9 L-12,4 L12,4 L9,-9 Z" fill="#F2508C" />
      <circle cx="0" cy="-14" r="9" fill="#F4B183" />
      {/* Hair covers only the top half of the head, leaving the face visible. */}
      <path d="M-9,-14 A9,9 0 0 1 9,-14 Z" fill="#6B4226" />
      <circle cx="-10" cy="-13" r="3.2" fill="#6B4226" />
      <circle cx="10" cy="-13" r="3.2" fill="#6B4226" />
      <circle cx="-3" cy="-11" r="1.3" fill="#2b2320" stroke="none" />
      <circle cx="3" cy="-11" r="1.3" fill="#2b2320" stroke="none" />
      <path d="M-2.5,-7 Q0,-5.5 2.5,-7" fill="none" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  ),
  Boy: () => (
    <g {...OUTLINE}>
      <rect x="-10" y="4" width="6" height="14" rx="2" fill="#2B3A55" />
      <rect x="4" y="4" width="6" height="14" rx="2" fill="#2B3A55" />
      <path d="M-9,-9 L-11,4 L11,4 L9,-9 Z" fill="#3D8BFF" />
      <circle cx="0" cy="-14" r="9" fill="#F4B183" />
      {/* Hair covers only the top third of the head, leaving the face visible. */}
      <path d="M-9,-15.5 A9,9 0 0 1 9,-15.5 L9,-19 L-9,-19 Z" fill="#3B2A1E" />
      <circle cx="-3" cy="-11" r="1.3" fill="#2b2320" stroke="none" />
      <circle cx="3" cy="-11" r="1.3" fill="#2b2320" stroke="none" />
      <path d="M-2.5,-7 Q0,-5.5 2.5,-7" fill="none" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  ),
};

export type SpriteName = keyof typeof SPRITES;
