/**
 * Central user-configurable supply-temperature limits. The heat-pump setpoint
 * and the tank-sonde target both clamp to this range.
 */
export const MAX_SUPPLY_C = 75;
export const MIN_SUPPLY_C = 30;

/**
 * Illustrative water colour. 25 °C is blue, grading through light blue and a
 * yellow transition into orange, orange-red and finally a dark red at 75 °C.
 * Outside 25–75 °C the ends clamp.
 */
const STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 25, rgb: [37, 99, 235] },
  { t: 30, rgb: [56, 189, 248] },
  { t: 35, rgb: [190, 220, 140] },
  { t: 40, rgb: [250, 170, 45] },
  { t: 45, rgb: [249, 115, 22] },
  { t: 50, rgb: [234, 88, 12] },
  { t: 55, rgb: [225, 55, 25] },
  { t: 65, rgb: [205, 35, 28] },
  { t: 75, rgb: [153, 27, 27] },
];

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function temperatureColor(celsius: number): string {
  const t = Number.isFinite(celsius) ? celsius : 20;
  if (t <= STOPS[0].t) return rgb(STOPS[0].rgb);
  const last = STOPS[STOPS.length - 1];
  if (t >= last.t) return rgb(last.rgb);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const u = (t - a.t) / (b.t - a.t);
      return rgb([
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * u),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * u),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * u),
      ]);
    }
  }
  return rgb(last.rgb);
}

function rgb([r, g, b]: [number, number, number]): string {
  return `rgb(${r} ${g} ${b})`;
}

export function formatNum(value: number | null | undefined, digits: number): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return value.toFixed(digits);
}
