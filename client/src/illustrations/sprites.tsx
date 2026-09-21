// A small library of flat, colorful vector "sprites" used to compose each
// page's illustration. Books describe a scene as a list of {sprite, x, y}
// placements (see types/book.ts); this file is the only place that knows
// how to actually draw each sprite. Keeping illustrations as vector data
// (rather than raster images) means new AI-generated books can ship as
// plain JSON scene descriptions with no image-generation step required,
// and the same data can later be rendered natively on mobile too.

import type { JSX } from "react";

// Every sprite is drawn centered on (0,0) within roughly a 40x40 box,
// so callers can position it with a simple translate + scale.
export const SPRITES: Record<string, () => JSX.Element> = {
  Sun: () => (
    <g>
      <circle r="14" fill="#FFC94A" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = Math.cos(angle) * 18, y1 = Math.sin(angle) * 18;
        const x2 = Math.cos(angle) * 24, y2 = Math.sin(angle) * 24;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFC94A" strokeWidth="3" strokeLinecap="round" />;
      })}
    </g>
  ),
  Moon: () => (
    <g>
      <path d="M10,-16 A16,16 0 1 0 10,16 A12,12 0 1 1 10,-16 Z" fill="#FDE68A" />
    </g>
  ),
  Cloud: () => (
    <g fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1">
      <ellipse cx="-10" cy="4" rx="12" ry="9" />
      <ellipse cx="8" cy="0" rx="16" ry="12" />
      <ellipse cx="22" cy="6" rx="10" ry="7" />
    </g>
  ),
  Star: () => (
    <path
      d="M0,-14 L3.5,-4 L14,-4 L5.5,2.5 L8.5,13 L0,6.5 L-8.5,13 L-5.5,2.5 L-14,-4 L-3.5,-4 Z"
      fill="#FDE047"
    />
  ),
  Tree: () => (
    <g>
      <rect x="-4" y="6" width="8" height="20" rx="2" fill="#8B5E34" />
      <circle cx="0" cy="-8" r="20" fill="#4CAF7D" />
      <circle cx="-12" cy="2" r="12" fill="#5BC28A" />
      <circle cx="12" cy="2" r="12" fill="#5BC28A" />
    </g>
  ),
  Flower: () => (
    <g>
      <rect x="-1.5" y="4" width="3" height="16" fill="#5BC28A" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx={0}
          cy={-8}
          rx="5"
          ry="8"
          fill="#FF8FB1"
          transform={`rotate(${deg} 0 -8)`}
        />
      ))}
      <circle cx="0" cy="-8" r="4" fill="#FFC94A" />
    </g>
  ),
  Fence: () => (
    <g fill="#D8B48A" stroke="#B8925F" strokeWidth="1">
      <rect x="-24" y="-2" width="48" height="5" />
      {[-20, -8, 4, 16].map((x) => (
        <rect key={x} x={x} y="-14" width="6" height="24" rx="1" />
      ))}
    </g>
  ),
  Bench: () => (
    <g fill="#B8925F">
      <rect x="-20" y="-4" width="40" height="5" rx="1" />
      <rect x="-20" y="6" width="40" height="5" rx="1" />
      <rect x="-18" y="-4" width="4" height="18" />
      <rect x="14" y="-4" width="4" height="18" />
    </g>
  ),
  House: () => (
    <g>
      <rect x="-20" y="-2" width="40" height="26" fill="#FFD9A0" />
      <path d="M-24,-2 L0,-22 L24,-2 Z" fill="#E8735A" />
      <rect x="-6" y="8" width="12" height="16" fill="#8B5E34" />
      <rect x="10" y="4" width="8" height="8" fill="#BEE3F8" />
    </g>
  ),
  Window: () => (
    <g>
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#BEE3F8" stroke="#8FB8D9" strokeWidth="2" />
      <line x1="0" y1="-12" x2="0" y2="12" stroke="#8FB8D9" strokeWidth="2" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="#8FB8D9" strokeWidth="2" />
    </g>
  ),
  Table: () => (
    <g fill="#C08552">
      <rect x="-18" y="-4" width="36" height="6" rx="1" />
      <rect x="-14" y="2" width="4" height="16" />
      <rect x="10" y="2" width="4" height="16" />
    </g>
  ),
  Lamp: () => (
    <g>
      <rect x="-2" y="0" width="4" height="20" fill="#B8925F" />
      <path d="M-10,-14 L10,-14 L6,0 L-6,0 Z" fill="#FFE29A" />
    </g>
  ),
  Book: () => (
    <g>
      <rect x="-12" y="-9" width="24" height="18" rx="2" fill="#6FA8DC" />
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#FFFFFF" strokeWidth="2" />
    </g>
  ),
  Bag: () => (
    <g>
      <path d="M-9,-6 L9,-6 L11,14 L-11,14 Z" fill="#E8735A" />
      <path d="M-5,-6 C-5,-14 5,-14 5,-6" fill="none" stroke="#8B4A3B" strokeWidth="2.5" />
    </g>
  ),
  Dog: () => (
    <g>
      <ellipse cx="0" cy="6" rx="16" ry="10" fill="#C08552" />
      <circle cx="14" cy="-4" r="10" fill="#C08552" />
      <path d="M20,-10 L28,-18 L22,-4 Z" fill="#8B5E34" />
      <path d="M8,-10 L2,-18 L10,-4 Z" fill="#8B5E34" />
      <circle cx="17" cy="-5" r="1.6" fill="#3B2A1E" />
      <ellipse cx="22" cy="-1" rx="2.2" ry="1.6" fill="#3B2A1E" />
      <rect x="-18" y="10" width="5" height="8" fill="#8B5E34" />
      <rect x="10" y="10" width="5" height="8" fill="#8B5E34" />
      <path d="M-16,4 Q-24,-2 -18,-8" fill="none" stroke="#C08552" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  Cat: () => (
    <g>
      <ellipse cx="0" cy="6" rx="14" ry="9" fill="#7B7B85" />
      <circle cx="12" cy="-5" r="9" fill="#7B7B85" />
      <path d="M6,-12 L9,-20 L13,-11 Z" fill="#7B7B85" />
      <path d="M18,-12 L15,-20 L21,-11 Z" fill="#7B7B85" />
      <circle cx="14" cy="-6" r="1.4" fill="#1F1F26" />
      <circle cx="9" cy="-6" r="1.4" fill="#1F1F26" />
      <path d="M-14,4 Q-22,-4 -14,-10" fill="none" stroke="#7B7B85" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  Ball: () => (
    <g>
      <circle r="12" fill="#EF4444" />
      <path d="M-12,0 A12,12 0 0 0 12,0" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M0,-12 A12,12 0 0 0 0,12" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
    </g>
  ),
  Magnifier: () => (
    <g fill="none" stroke="#4B5563" strokeWidth="3">
      <circle cx="-3" cy="-3" r="11" fill="#DBEAFE" />
      <line x1="6" y1="6" x2="16" y2="16" strokeLinecap="round" />
    </g>
  ),
  Girl: () => (
    <g>
      <circle cx="0" cy="-14" r="9" fill="#F3C9A0" />
      <path d="M-9,-14 A9,9 0 0 1 9,-14 L9,-6 Q0,-2 -9,-6 Z" fill="#7C4A2D" />
      <path d="M-9,-9 L-12,4 L12,4 L9,-9 Z" fill="#F472B6" />
      <rect x="-11" y="4" width="6" height="14" fill="#F3C9A0" />
      <rect x="5" y="4" width="6" height="14" fill="#F3C9A0" />
    </g>
  ),
  Boy: () => (
    <g>
      <circle cx="0" cy="-14" r="9" fill="#F3C9A0" />
      <path d="M-9,-16 A9,9 0 0 1 9,-16 L9,-19 L-9,-19 Z" fill="#4B3621" />
      <path d="M-9,-9 L-11,4 L11,4 L9,-9 Z" fill="#60A5FA" />
      <rect x="-10" y="4" width="6" height="14" fill="#3B3B45" />
      <rect x="4" y="4" width="6" height="14" fill="#3B3B45" />
    </g>
  ),
};

export type SpriteName = keyof typeof SPRITES;
