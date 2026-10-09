import type { Oklch } from "./types"

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Normalizes any hue (including negatives, 360 and NaN) into [0, 360). */
export function normalizeHue(h: number): number {
  if (!Number.isFinite(h)) return 0
  const n = ((h % 360) + 360) % 360
  // Guard against -0 and floating point results such as 359.99999999.
  return n >= 359.9995 || Object.is(n, -0) ? 0 : n
}

const round = (value: number, digits: number) => {
  const f = 10 ** digits
  return Math.round(value * f) / f
}

/**
 * Snaps a color onto the precision used in the CSS output so every calculation
 * (contrast, gamut checks) works on exactly the values that get serialized.
 * Chroma is floored so quantization can never push a mapped color out of gamut.
 */
export function quantize(color: Oklch): Oklch {
  const l = round(clamp(color.l, 0, 1), 3)
  const c = Math.max(0, Math.floor(color.c * 1000 + 1e-9) / 1000)
  const h = c === 0 ? 0 : normalizeHue(round(normalizeHue(color.h), 1))
  return { l, c, h }
}

export function oklch(l: number, c: number, h: number): Oklch {
  return { l, c, h: normalizeHue(h) }
}

/** Formats a color as `oklch(0.420 0.100 155)`. */
export function formatOklch(color: Oklch): string {
  const q = quantize(color)
  const hue = Number.isInteger(q.h) ? q.h.toString() : q.h.toFixed(1)
  return `oklch(${q.l.toFixed(3)} ${q.c.toFixed(3)} ${hue})`
}

/** Shortest signed angular distance between two hues, in degrees. */
export function hueDistance(a: number, b: number): number {
  const d = normalizeHue(b - a)
  return d > 180 ? d - 360 : d
}
