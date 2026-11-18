/** Illustrative water colour. Cool is blue, warm is amber, hot is red. */
const STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 16, rgb: [37, 99, 235] },
  { t: 27, rgb: [14, 165, 233] },
  { t: 35, rgb: [251, 146, 60] },
  { t: 45, rgb: [239, 68, 68] },
  { t: 62, rgb: [153, 27, 27] },
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
