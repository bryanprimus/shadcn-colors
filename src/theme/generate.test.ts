import { describe, expect, it } from "vitest"

import { contrastRatio } from "./contrast"
import { generateTheme } from "./generate"
import { isInGamut } from "./gamut"
import { parseBrandColor } from "./parse"
import { serializeGlobalsCss } from "./serialize"
import { normalizeHue } from "./color"
import { COLOR_TOKENS, DEFAULT_OPTIONS, type Oklch } from "./types"

const CASES: Record<string, string> = {
  "dark forest green": "oklch(0.42 0.10 155)",
  "bright yellow": "oklch(0.92 0.19 100)",
  "very dark blue": "oklch(0.18 0.09 265)",
  "very light brand": "oklch(0.97 0.03 330)",
  "high chroma violet": "oklch(0.55 0.30 295)",
  "nearly neutral": "oklch(0.50 0.008 250)",
  "hue near 0": "oklch(0.60 0.20 0.4)",
  "hue near 360": "oklch(0.60 0.20 359.7)",
  "pure black": "oklch(0 0 0)",
  "pure white": "oklch(1 0 0)",
  "out of gamut cyan": "oklch(0.70 0.40 200)",
}

function brand(input: string): Oklch {
  const r = parseBrandColor(input)
  if (!r.ok) throw new Error(r.error)
  return r.color
}

describe("parseBrandColor", () => {
  it("accepts oklch() and bare L C H", () => {
    expect(parseBrandColor("oklch(0.42 0.10 155)")).toMatchObject({ ok: true, normalized: "oklch(0.420 0.100 155)" })
    expect(parseBrandColor("0.42 0.10 155")).toMatchObject({ ok: true, normalized: "oklch(0.420 0.100 155)" })
    expect(parseBrandColor("42% 0.1 155deg")).toMatchObject({ ok: true, normalized: "oklch(0.420 0.100 155)" })
  })
  it("normalizes hue", () => {
    expect(parseBrandColor("0.5 0.1 -30")).toMatchObject({ ok: true, color: { h: 330 } })
    expect(parseBrandColor("0.5 0.1 720")).toMatchObject({ ok: true, color: { h: 0 } })
    expect(normalizeHue(360)).toBe(0)
    expect(normalizeHue(-0.0001)).toBe(0)
    expect(normalizeHue(Number.NaN)).toBe(0)
  })
  it("rejects invalid input", () => {
    expect(parseBrandColor("").ok).toBe(false)
    expect(parseBrandColor("banana").ok).toBe(false)
    expect(parseBrandColor("0.5 -0.1 20").ok).toBe(false)
    expect(parseBrandColor("1.5 0.1 20").ok).toBe(true) // 1.5 is read as 1.5% lightness
    expect(parseBrandColor("oklch(0.5 0.1 20 / 0.5)").ok).toBe(false)
  })
  it("flags out of gamut input", () => {
    expect(parseBrandColor("oklch(0.7 0.4 200)")).toMatchObject({ ok: true, inGamut: false })
  })
})

describe.each(Object.entries(CASES))("generateTheme: %s", (_name, input) => {
  const theme = generateTheme(brand(input))

  it("produces every token in both modes with finite, valid values", () => {
    for (const mode of [theme.light, theme.dark]) {
      for (const token of COLOR_TOKENS) {
        const c = mode[token]
        expect(c, token).toBeDefined()
        expect(Number.isFinite(c.l) && Number.isFinite(c.c) && Number.isFinite(c.h), token).toBe(true)
        expect(c.c, token).toBeGreaterThanOrEqual(0)
        expect(c.l, token).toBeGreaterThanOrEqual(0)
        expect(c.l, token).toBeLessThanOrEqual(1)
        expect(c.h, token).toBeGreaterThanOrEqual(0)
        expect(c.h, token).toBeLessThan(360)
        expect(isInGamut(c), `${token} in gamut`).toBe(true)
      }
    }
  })

  it("serializes deterministically without NaN or float noise", () => {
    const a = serializeGlobalsCss(theme)
    const b = serializeGlobalsCss(generateTheme(brand(input)))
    expect(a).toBe(b)
    expect(a).not.toMatch(/NaN|undefined|Infinity/)
    for (const m of a.matchAll(/oklch\(([^)]*)\)/g)) {
      expect(m[1]).toMatch(/^\d\.\d{3} \d\.\d{3} \d{1,3}(\.\d)?$/)
    }
    expect(a.match(/ {2}--sidebar-ring:/g)).toHaveLength(2) // :root and .dark
    expect(a).toContain("--color-sidebar-ring: var(--sidebar-ring);")
  })

  it("meets the intended text contrast after correction", () => {
    for (const check of theme.analysis.checks) {
      if (check.kind === "text") expect(check.ratio, `${check.mode} ${check.foreground}/${check.background}`).toBeGreaterThanOrEqual(check.target - 0.01)
    }
  })

  it("keeps dark surfaces dark and light surfaces light (no inversion shortcuts)", () => {
    expect(theme.light.background.l).toBeGreaterThan(0.95)
    expect(theme.dark.background.l).toBeLessThan(0.2)
    expect(theme.dark.card.l).toBeGreaterThan(theme.dark.background.l)
    expect(theme.dark.border.l).toBeGreaterThan(theme.dark.card.l)
    expect(theme.light.border.l).toBeLessThan(theme.light.secondary.l)
  })
})

describe("theme relationships", () => {
  it("keeps destructive red regardless of brand hue", () => {
    for (const input of Object.values(CASES)) {
      const t = generateTheme(brand(input))
      for (const d of [t.light.destructive, t.dark.destructive]) {
        expect(d.h > 340 || d.h < 45).toBe(true)
      }
    }
  })

  it("brightens a dark brand for dark mode and preserves hue", () => {
    const t = generateTheme(brand(CASES["dark forest green"]))
    expect(t.light.primary).toMatchObject({ l: 0.42, c: 0.1, h: 155 })
    expect(t.dark.primary.l).toBeGreaterThanOrEqual(0.68)
    expect(t.dark.primary.l).toBeLessThanOrEqual(0.8)
    expect(t.dark.primary.h).toBe(155)
    expect(t.dark.primary.c).toBeGreaterThanOrEqual(0.085)
  })

  it("picks a dark foreground for a bright primary", () => {
    const t = generateTheme(brand(CASES["bright yellow"]))
    expect(t.light["primary-foreground"].l).toBeLessThan(0.4)
    expect(t.dark["primary-foreground"].l).toBeLessThan(0.4)
  })

  it("keeps surfaces atmospheric for saturated brands", () => {
    const t = generateTheme(brand(CASES["high chroma violet"]))
    expect(t.light.background.c).toBeLessThanOrEqual(0.008)
    expect(t.dark.background.c).toBeLessThanOrEqual(0.012)
    expect(t.light.accent.c).toBeLessThanOrEqual(0.05)
  })

  it("treats hue near 0 and near 360 the same way", () => {
    const a = generateTheme(brand(CASES["hue near 0"]))
    const b = generateTheme(brand(CASES["hue near 360"]))
    expect(Math.abs(a.light.primary.l - b.light.primary.l)).toBeLessThan(0.02)
    expect(Math.abs(contrastRatio(a.light.primary, a.light.background) - contrastRatio(b.light.primary, b.light.background))).toBeLessThan(0.3)
  })

  it("uses five distinct chart hues", () => {
    const t = generateTheme(brand(CASES["dark forest green"]))
    const hues = new Set([1, 2, 3, 4, 5].map((i) => Math.round(t.light[`chart-${i}` as "chart-1"].h / 30)))
    expect(hues.size).toBe(5)
  })

  it("responds predictably to advanced options", () => {
    const b = brand(CASES["dark forest green"])
    const base = generateTheme(b)
    expect(generateTheme(b, { surfaceTint: 0 }).light.background.c).toBe(0)
    expect(generateTheme(b, { accentStrength: 2 }).light.accent.c).toBeGreaterThan(base.light.accent.c)
    expect(generateTheme(b, { darkPrimaryLightness: 0.8 }).dark.primary.l).toBeCloseTo(0.8, 1)
    expect(generateTheme(b, { borderStrength: 2 }).light.border.l).toBeLessThan(base.light.border.l)
    const high = generateTheme(b, { contrast: "high" })
    expect(high.analysis.checks.filter((c) => c.foreground === "foreground").every((c) => c.ratio >= 7)).toBe(true)
    expect(serializeGlobalsCss(generateTheme(b, { radius: 0.5 }))).toContain("--radius: 0.5rem;")
  })

  it("does not crash on extreme or malformed numeric input", () => {
    const extremes: Oklch[] = [
      { l: Number.NaN, c: Number.NaN, h: Number.NaN },
      { l: -1, c: -1, h: -720 },
      { l: 2, c: 5, h: 1e9 },
      { l: 0.5, c: 0.5, h: 359.99999 },
    ]
    for (const e of extremes) {
      const t = generateTheme(e)
      expect(serializeGlobalsCss(t)).not.toMatch(/NaN/)
    }
  })

  it("matches the shadcn globals.css structure", () => {
    const css = serializeGlobalsCss(generateTheme(brand(CASES["dark forest green"]), DEFAULT_OPTIONS))
    const order = ['@import "tailwindcss";', '@import "tw-animate-css";', '@import "shadcn/tailwind.css";', "@custom-variant dark (&:is(.dark *));", "@theme inline {", ":root {", ".dark {", "@layer base {"]
    let last = -1
    for (const marker of order) {
      const i = css.indexOf(marker)
      expect(i, marker).toBeGreaterThan(last)
      last = i
    }
    expect(css).toContain("--radius-4xl: calc(var(--radius) * 2.6);")
  })
})
