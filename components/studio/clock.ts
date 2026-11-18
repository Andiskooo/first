/**
 * One animation clock for every pipe. Distance is integrated from flow speed
 * so changing the pump does not jump the particles back to the start.
 */
const distances = new Map<string, number>();
const speeds = new Map<string, number>();
const listeners = new Set<() => void>();

let running = false;
let raf = 0;
let last = 0;
let carry = 0;

function frame(now: number) {
  raf = window.requestAnimationFrame(frame);
  if (!last) last = now;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!running) return;
  carry += dt;
  if (carry < 1 / 30) return;
  const step = carry;
  carry = 0;
  let moved = false;
  for (const [id, px] of speeds) {
    if (px <= 0) continue;
    distances.set(id, (distances.get(id) ?? 0) + px * step);
    moved = true;
  }
  if (moved) listeners.forEach((listener) => listener());
}

function ensure() {
  if (typeof window === 'undefined' || raf) return;
  last = 0;
  raf = window.requestAnimationFrame(frame);
}

export function setEdgeSpeeds(next: Map<string, number>, isRunning: boolean) {
  speeds.clear();
  for (const [id, px] of next) speeds.set(id, px);
  running = isRunning && next.size > 0;
  if (running) ensure();
}

export function resetDistances() {
  distances.clear();
  carry = 0;
  listeners.forEach((listener) => listener());
}

export function stopClock() {
  running = false;
  if (raf && typeof window !== 'undefined') window.cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
}

export function subscribeClock(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function edgeDistance(id: string): number {
  return distances.get(id) ?? 0;
}
