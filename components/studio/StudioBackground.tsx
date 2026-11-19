'use client';

import { useViewport } from '@xyflow/react';

/**
 * Minimal engineering/CAD canvas background.
 *
 * Pure white with three alignment layers sharing one origin so they never
 * drift apart while panning or zooming:
 * - Layer A: fine microdots, 6px tile, ~1px, very light gray.
 * - Layer B: secondary dots, 61px tile, ~2px, dark gray.
 * - Layer C: major crosshair markers, 122px tile, ~12px arms, 1px stroke.
 *
 * One absolutely positioned div (the same stacking slot as ReactFlow's own
 * Background: `react-flow__background`, z-index -1, pointer-events none), so
 * it stays behind nodes/edges and never intercepts selection, dragging,
 * pipe connections, or resize handles. No DOM per marker: three tiled SVG
 * data-URIs scaled by the viewport zoom.
 */

const MICRO_GAP = 6;
const SECONDARY_GAP = 61;
const MAJOR_GAP = 122;

const MICRO_DOT = '#e3e3e6';
const SECONDARY_DOT = '#71717a';
const CROSSHAIR = '#52525b';

const microTile = `<svg xmlns='http://www.w3.org/2000/svg' width='${MICRO_GAP}' height='${MICRO_GAP}'><circle cx='1' cy='1' r='0.55' fill='${MICRO_DOT}'/></svg>`;
const secondaryTile = `<svg xmlns='http://www.w3.org/2000/svg' width='${SECONDARY_GAP}' height='${SECONDARY_GAP}'><circle cx='1' cy='1' r='1' fill='${SECONDARY_DOT}'/></svg>`;
const majorTile =
  `<svg xmlns='http://www.w3.org/2000/svg' width='${MAJOR_GAP}' height='${MAJOR_GAP}'>` +
  `<path d='M55 61h12M61 55v12' stroke='${CROSSHAIR}' stroke-width='1'/>` +
  `</svg>`;

const encode = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const MAJOR_BG = encode(majorTile);
const SECONDARY_BG = encode(secondaryTile);
const MICRO_BG = encode(microTile);

export function StudioBackground() {
  const { x, y, zoom } = useViewport();

  const major = Math.max(MAJOR_GAP * zoom, 1);
  const secondary = Math.max(SECONDARY_GAP * zoom, 1);
  const micro = MICRO_GAP * zoom;
  // Below ~0.55 the 6px dots sub-sample into moiré, so the micro layer rests
  // while the secondary dots and crosshairs keep anchoring the grid.
  const showMicro = micro >= 3.2;

  const layers = showMicro ? [MAJOR_BG, SECONDARY_BG, MICRO_BG] : [MAJOR_BG, SECONDARY_BG];
  const sizes = showMicro
    ? [`${major}px ${major}px`, `${secondary}px ${secondary}px`, `${micro}px ${micro}px`]
    : [`${major}px ${major}px`, `${secondary}px ${secondary}px`];
  // Shared origin for all three layers: identical offsets keep the
  // microdots, secondary dots, and crosshairs aligned at every
  // zoom level and pan position.
  const positions = layers.map(() => `${x}px ${y}px`);

  return (
    <div
      aria-hidden
      className="react-flow__background react-flow__container"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: layers.join(', '),
        backgroundSize: sizes.join(', '),
        backgroundPosition: positions.join(', '),
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
