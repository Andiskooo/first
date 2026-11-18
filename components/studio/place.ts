import { componentBox, defaultParams, getComponent } from '@/components/studio/registry';

export const SNAP = 20;

/** Movement below this is a tap (arm the part). At or above it, the pointer is dragging. */
export const PLACE_DRAG_THRESHOLD = 8;

export function pointerGesture(dx: number, dy: number, threshold = PLACE_DRAG_THRESHOLD): 'tap' | 'drag' {
  return Math.hypot(dx, dy) >= threshold ? 'drag' : 'tap';
}

export function pointInRect(
  x: number,
  y: number,
  rect: { left: number; top: number; right: number; bottom: number },
): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/** What the library writes onto a drag, and what the canvas reads back. */
export interface DropPayload {
  types?: ArrayLike<string>;
  getData: (type: string) => string;
}

/**
 * The id of a palette part, or null when the drag is something else (a photo,
 * a text selection, an empty payload). A null result is ignored by the drop
 * handler, so this is the only gate between a drag and a new node.
 */
export function droppedPartId(data: DropPayload | null | undefined): string | null {
  if (!data) return null;
  const types = data.types ? Array.from(data.types) : [];
  const raw = types.includes('application/x-ecotek-part')
    ? data.getData('application/x-ecotek-part')
    : data.getData('text/plain');
  const id = raw.trim();
  return id && getComponent(id) ? id : null;
}

export interface PlacedPart {
  id: string;
  componentId: string;
  params: Record<string, number>;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The node the canvas drop handler and the click-to-place handler both create. */
export function createPlacedPart(componentId: string, x: number, y: number, seq: number): PlacedPart | null {
  const def = getComponent(componentId);
  if (!def) return null;
  const params = defaultParams(def);
  const box = componentBox(def, params);
  return {
    id: `${def.code}-${seq}`,
    componentId,
    params,
    x: Math.round((x - box.width / 2) / SNAP) * SNAP,
    y: Math.round((y - box.height / 2) / SNAP) * SNAP,
    width: box.width,
    height: box.height,
  };
}

let lastDropAt = 0;

export function markPartDropped(): void {
  lastDropAt = Date.now();
}

/** True only for the click the browser fires on the card immediately after a successful drop. */
export function consumeRecentDrop(): boolean {
  if (Date.now() - lastDropAt > 500) return false;
  lastDropAt = 0;
  return true;
}
