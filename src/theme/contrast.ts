import { wcagContrast } from "culori"

import { clamp } from "./color"
import { finalize } from "./gamut"
import type { Oklch } from "./types"

/** WCAG 2 contrast ratio between two colors, rounded to 2 decimals. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const ratio = wcagContrast(
    { mode: "oklch", l: a.l, c: a.c, h: a.h },
    { mode: "oklch", l: b.l, c: b.c, h: b.h }
  )
  return Math.round(ratio * 100) / 100
}

export interface ForegroundResult {
  color: Oklch
  /** Background after any correction needed to reach the target. */
  background: Oklch
  ratio: number
  ink: "light" | "dark"
  /** Why this ink won, for the analysis panel. */
  reason: string
  backgroundAdjusted: boolean
}

interface InkOptions {
  hue: number
  /** Chroma used to tint the inks with the brand hue. */
  tint: number
  target: number
  /** Allow shifting the background lightness when no ink can reach the target. */
  allowBackgroundShift?: boolean
  /** Lightness of the preferred dark and light inks. */
  darkL?: number
  lightL?: number
}

function ink(l: number, c: number, h: number) {
  return finalize({ l, c, h })
}

/**
 * Picks the foreground for a filled background from its actual computed
 * contrast rather than assuming white. Both a tinted dark ink and a tinted
 * light ink are tried; the higher contrast wins. When neither reaches the
 * target, the ink is pushed to the extreme, and if allowed the background
 * lightness is nudged away from the ink until the target is met.
 */
export function pickForeground(bg: Oklch, opts: InkOptions): ForegroundResult {
  const darkL = opts.darkL ?? 0.18
  const lightL = opts.lightL ?? 0.985
  const darkInk = ink(darkL, opts.tint, opts.hue)
  const lightInk = ink(lightL, opts.tint * 0.25, opts.hue)
  const dark = contrastRatio(darkInk, bg)
  const light = contrastRatio(lightInk, bg)
  const useDark = dark > light
  let color = useDark ? darkInk : lightInk
  let ratio = Math.max(dark, light)
  let background = bg
  let backgroundAdjusted = false
  const reason = useDark
    ? `Dark foreground selected because it provided greater contrast (${dark.toFixed(2)}:1 vs ${light.toFixed(2)}:1 for light).`
    : `Light foreground selected because it provided greater contrast (${light.toFixed(2)}:1 vs ${dark.toFixed(2)}:1 for dark).`

  // Push the ink toward pure black/white, keeping a trace of hue.
  if (ratio < opts.target) {
    for (let step = 1; step <= 20 && ratio < opts.target; step++) {
      const t = step / 20
      const l = useDark ? darkL * (1 - t) : lightL + (1 - lightL) * t
      color = ink(l, opts.tint * (1 - t), opts.hue)
      ratio = contrastRatio(color, background)
    }
  }

  // Last resort: move the background away from the ink.
  if (ratio < opts.target && opts.allowBackgroundShift) {
    for (let step = 1; step <= 40 && ratio < opts.target; step++) {
      const l = clamp(bg.l + (useDark ? 0.005 : -0.005) * step, 0, 1)
      background = finalize({ ...bg, l })
      ratio = contrastRatio(color, background)
      backgroundAdjusted = true
    }
  }

  return { color, background, ratio, ink: useDark ? "dark" : "light", reason, backgroundAdjusted }
}

/**
 * Moves a text color's lightness (keeping hue and chroma) until it reaches
 * `target` against every listed background. Used for muted foreground, which
 * should stay subordinate but readable.
 */
export function ensureTextContrast(
  text: Oklch,
  backgrounds: Oklch[],
  target: number,
  direction: "darker" | "lighter"
): { color: Oklch; ratio: number; adjusted: boolean } {
  let color = finalize(text)
  const minRatio = (c: Oklch) => Math.min(...backgrounds.map((b) => contrastRatio(c, b)))
  let ratio = minRatio(color)
  let adjusted = false
  for (let step = 0; step < 200 && ratio < target; step++) {
    const l = clamp(color.l + (direction === "darker" ? -0.005 : 0.005), 0, 1)
    if (l === color.l) break
    color = finalize({ ...color, l })
    ratio = minRatio(color)
    adjusted = true
  }
  return { color, ratio, adjusted }
}
