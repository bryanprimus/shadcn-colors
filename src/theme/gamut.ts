import { clampChroma, displayable } from "culori"

import { clamp, normalizeHue, quantize } from "./color"
import type { Oklch } from "./types"

const toCulori = (c: Oklch) => ({ mode: "oklch" as const, l: c.l, c: c.c, h: c.h })

/** True when the color can be shown in sRGB without clipping. */
export function isInGamut(color: Oklch): boolean {
  return displayable(toCulori(color))
}

/**
 * Maps a color into sRGB by reducing chroma only. Lightness and hue are kept
 * exactly, which preserves perceptual intent (culori's binary search clamp).
 */
export function mapToGamut(color: Oklch): Oklch {
  const l = clamp(color.l, 0, 1)
  const h = normalizeHue(color.h)
  const c = Math.max(0, Number.isFinite(color.c) ? color.c : 0)
  if (c === 0) return { l, c: 0, h }
  const input = { mode: "oklch" as const, l, c, h }
  if (displayable(input)) return { l, c, h }
  const mapped = clampChroma(input, "oklch", "rgb")
  return { l, c: Math.max(0, mapped.c ?? 0), h }
}

/** Gamut maps then quantizes, re-checking that rounding did not leave sRGB. */
export function finalize(color: Oklch): Oklch {
  let q = quantize(mapToGamut(color))
  for (let i = 0; i < 20 && q.c > 0 && !isInGamut(q); i++) {
    q = { ...q, c: Math.max(0, Math.round((q.c - 0.001) * 1000) / 1000) }
  }
  return q
}

/** Highest sRGB chroma available at a given lightness and hue. */
export function maxChroma(l: number, h: number): number {
  return mapToGamut({ l, c: 0.5, h }).c
}

/**
 * Lightness at which a hue reaches its maximum sRGB chroma (the gamut cusp).
 * Yellows peak near 0.97, blues near 0.45. Brands whose identity depends on a
 * light cusp (yellow, lime, cyan) need a lighter usable primary.
 */
export function cuspLightness(h: number): number {
  let best = 0.5
  let bestC = -1
  for (let l = 0.3; l <= 0.98; l += 0.01) {
    const c = maxChroma(l, h)
    if (c > bestC) {
      bestC = c
      best = l
    }
  }
  return Math.round(best * 100) / 100
}
