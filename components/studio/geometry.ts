import { Position } from '@xyflow/react';

/** Handle position after a clockwise rotation, with the node box swapped at 90° and 270°. */
export function portPlacement(width: number, height: number, x: number, y: number, rotation: number) {
  const quarter = ((Math.round(rotation / 90) % 4) + 4) % 4;
  const turned = quarter === 1 || quarter === 3;
  const boxW = turned ? height : width;
  const boxH = turned ? width : height;
  const dx = x * width - width / 2;
  const dy = y * height - height / 2;
  let rx = dx;
  let ry = dy;
  if (quarter === 1) { rx = -dy; ry = dx; }
  else if (quarter === 2) { rx = -dx; ry = -dy; }
  else if (quarter === 3) { rx = dy; ry = -dx; }
  const left = rx + boxW / 2;
  const top = ry + boxH / 2;
  const nx = left / boxW;
  const ny = top / boxH;
  let position = Position.Bottom;
  const distances = [
    { position: Position.Left, distance: nx },
    { position: Position.Right, distance: 1 - nx },
    { position: Position.Top, distance: ny },
    { position: Position.Bottom, distance: 1 - ny },
  ];
  position = distances.reduce((best, item) => (item.distance < best.distance ? item : best)).position;
  return {
    boxW,
    boxH,
    style: { left: `${nx * 100}%`, top: `${ny * 100}%` },
    position,
  };
}

export type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se';

/** Scale limits relative to the component's default box. */
export const RESIZE_MIN_SCALE = 0.5;
export const RESIZE_MAX_SCALE = 3;
/** Absolute floor so a node stays selectable and its artwork stays legible. */
export const RESIZE_MIN_PX = 40;

/**
 * Proportional resize in canvas (flow) coordinates. The dragged corner follows
 * the pointer while the opposite corner stays fixed, so the node scales around
 * a stable anchor instead of jumping. Aspect comes from the default box, so a
 * resized node keeps its artwork proportions without drift.
 */
export function resizeProportional(input: {
  corner: ResizeCorner;
  /** Node position (top-left) when the gesture started, in flow coordinates. */
  startX: number;
  startY: number;
  /** Node size when the gesture started. */
  startW: number;
  startH: number;
  /** Default (registry) size: aspect source and min/max reference. */
  defW: number;
  defH: number;
  /** Pointer travel since gesture start, in flow coordinates. */
  dx: number;
  dy: number;
}): { x: number; y: number; width: number; height: number } {
  const { corner, startX, startY, startW, startH, defW, defH, dx, dy } = input;
  const wide = corner === 'ne' || corner === 'se';
  const tall = corner === 'sw' || corner === 'se';
  // Single aspect-locked scale driven by the dominant pointer axis, so both
  // horizontal and vertical drags feel natural from any corner.
  const scaleW = (wide ? startW + dx : startW - dx) / startW;
  const scaleH = (tall ? startH + dy : startH - dy) / startH;
  const scale = Math.abs(scaleW - 1) >= Math.abs(scaleH - 1) ? scaleW : scaleH;
  const lo = Math.max(defW * RESIZE_MIN_SCALE, RESIZE_MIN_PX, (RESIZE_MIN_PX * defW) / defH);
  const hi = defW * RESIZE_MAX_SCALE;
  const width = Math.min(hi, Math.max(lo, startW * scale));
  const height = (width * defH) / defW;
  return {
    x: wide ? startX : startX + startW - width,
    y: corner === 'nw' || corner === 'ne' ? startY + startH - height : startY,
    width,
    height,
  };
}
