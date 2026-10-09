import { converter, parse } from "culori"

import { formatOklch, normalizeHue, quantize } from "./color"
import { isInGamut } from "./gamut"
import type { Oklch } from "./types"

export type ParseResult =
  | {
      ok: true
      color: Oklch
      /** Canonical `oklch(L C H)` string for the parsed input. */
      normalized: string
      inGamut: boolean
      /** How the input was interpreted, e.g. "oklch()", "bare L C H", "hex". */
      source: string
    }
  | { ok: false; error: string }

const toOklch = converter("oklch")

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`
const BARE = new RegExp(
  String.raw`^(${NUMBER})(%?)[\s,]+(${NUMBER})(%?)[\s,]+(${NUMBER})(deg)?$`,
  "i"
)

function fromComponents(lRaw: number, lPct: boolean, cRaw: number, cPct: boolean, h: number) {
  // CSS semantics: L% maps 100% -> 1, C% maps 100% -> 0.4.
  let l = lPct ? lRaw / 100 : lRaw
  // Treat "42 0.1 155" as a percentage lightness, a common shorthand.
  if (!lPct && l > 1 && l <= 100) l = l / 100
  const c = cPct ? (cRaw / 100) * 0.4 : cRaw
  return { l, c, h }
}

function validate(l: number, c: number, h: number): string | null {
  if (![l, c, h].every(Number.isFinite)) return "Values must be finite numbers."
  if (l < 0 || l > 1) return "Lightness must be between 0 and 1 (or 0% and 100%)."
  if (c < 0) return "Chroma cannot be negative."
  if (c > 0.5) return "Chroma above 0.5 is outside any displayable gamut."
  return null
}

/**
 * Parses a brand color. Accepts `oklch(0.42 0.10 155)`, bare `0.42 0.10 155`,
 * percentage lightness, and as a convenience any CSS color culori understands
 * (hex, rgb(), hsl(), named colors), which is converted to OKLCH.
 */
export function parseBrandColor(input: string): ParseResult {
  const text = input.trim()
  if (!text) return { ok: false, error: "Enter a color, e.g. oklch(0.42 0.10 155)." }

  let l: number
  let c: number
  let h: number
  let source: string

  const bare = BARE.exec(text)
  if (bare) {
    ;({ l, c, h } = fromComponents(
      Number(bare[1]),
      bare[2] === "%",
      Number(bare[3]),
      bare[4] === "%",
      Number(bare[5])
    ))
    source = "bare L C H"
  } else {
    const parsed = parse(text)
    if (!parsed) return { ok: false, error: "Not a recognizable color." }
    if (parsed.alpha !== undefined && parsed.alpha < 1) {
      return { ok: false, error: "Brand colors must be opaque." }
    }
    const o = toOklch(parsed)
    l = o.l
    c = o.c
    h = o.h ?? 0
    source = parsed.mode === "oklch" ? "oklch()" : `${parsed.mode} converted to OKLCH`
  }

  const error = validate(l, c, h)
  if (error) return { ok: false, error }

  const color = quantize({ l, c, h: normalizeHue(h) })
  return {
    ok: true,
    color,
    normalized: formatOklch(color),
    inGamut: isInGamut(color),
    source,
  }
}
