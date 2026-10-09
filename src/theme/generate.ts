import { clamp, formatOklch, lerp, normalizeHue, hueDistance } from "./color"
import { contrastRatio, ensureTextContrast, pickForeground } from "./contrast"
import { cuspLightness, finalize, isInGamut } from "./gamut"
import {
  DEFAULT_OPTIONS,
  type AnalysisNote,
  type ColorToken,
  type ContrastCheck,
  type ContrastKind,
  type ContrastPreference,
  type GeneratedTheme,
  type Oklch,
  type ThemeMode,
  type ThemeOptions,
  type ThemeTokens,
} from "./types"

/*
 * Theme engine.
 *
 * The engine builds a perceptual lightness hierarchy first (surfaces, content,
 * borders) and then injects controlled amounts of the brand hue and chroma
 * into it. Dark mode is generated from its own lightness bands; it is never
 * an inversion of light mode. Every color is gamut mapped (chroma reduction at
 * constant L and H) and quantized before contrast is measured, so the numbers
 * in the analysis are the numbers in the CSS.
 */

interface ContrastProfile {
  text: number
  muted: number
  fg: { light: number; dark: number }
  mutedFg: { light: number; dark: number }
}

const CONTRAST: Record<ContrastPreference, ContrastProfile> = {
  soft: { text: 4.5, muted: 3, fg: { light: 0.22, dark: 0.93 }, mutedFg: { light: 0.56, dark: 0.66 } },
  standard: { text: 4.5, muted: 4.5, fg: { light: 0.18, dark: 0.96 }, mutedFg: { light: 0.5, dark: 0.72 } },
  high: { text: 7, muted: 5.5, fg: { light: 0.14, dark: 0.985 }, mutedFg: { light: 0.44, dark: 0.78 } },
}

/** Lightness band plus chroma relationship to the brand for one surface. */
interface SurfaceSpec {
  l: number
  /** Fraction of brand chroma. */
  ratio: number
  /** Absolute chroma cap. */
  cap: number
}

const LIGHT_SURFACES = {
  background: { l: 0.99, ratio: 0.045, cap: 0.008 },
  card: { l: 0.98, ratio: 0.06, cap: 0.01 },
  popover: { l: 0.98, ratio: 0.06, cap: 0.01 },
  secondary: { l: 0.95, ratio: 0.12, cap: 0.02 },
  muted: { l: 0.955, ratio: 0.08, cap: 0.014 },
  accent: { l: 0.93, ratio: 0.3, cap: 0.05 },
  border: { l: 0.9, ratio: 0.09, cap: 0.016 },
  sidebar: { l: 0.978, ratio: 0.06, cap: 0.01 },
  sidebarAccent: { l: 0.935, ratio: 0.25, cap: 0.04 },
} satisfies Record<string, SurfaceSpec>

const DARK_SURFACES = {
  background: { l: 0.13, ratio: 0.045, cap: 0.012 },
  card: { l: 0.17, ratio: 0.06, cap: 0.014 },
  popover: { l: 0.18, ratio: 0.06, cap: 0.014 },
  secondary: { l: 0.21, ratio: 0.12, cap: 0.022 },
  muted: { l: 0.22, ratio: 0.08, cap: 0.018 },
  accent: { l: 0.25, ratio: 0.3, cap: 0.05 },
  border: { l: 0.28, ratio: 0.1, cap: 0.018 },
  sidebar: { l: 0.16, ratio: 0.06, cap: 0.014 },
  sidebarAccent: { l: 0.24, ratio: 0.25, cap: 0.04 },
} satisfies Record<string, SurfaceSpec>

/** Brands below this chroma read as gray; fully neutral below NEUTRAL_LOW. */
const NEUTRAL_HIGH = 0.04
const NEUTRAL_LOW = 0.02

/** Chart hue offsets from the brand hue. Neighbouring series stay >= 60° apart. */
const CHART_OFFSETS = [0, 150, 60, 270, 210] as const
const CHART_LIGHT_L = [0, 0.62, 0.72, 0.52, 0.68] as const
const CHART_DARK_L = [0, 0.72, 0.8, 0.64, 0.76] as const

/** Shadcn's destructive reds, kept as the semantic anchor. */
const DESTRUCTIVE = {
  light: { l: 0.577, c: 0.245, h: 27.325 },
  dark: { l: 0.704, c: 0.191, h: 22.216 },
} as const

function surface(spec: SurfaceSpec, brand: Oklch, strength: number, lOverride?: number): Oklch {
  const capScale = Math.max(1, strength)
  const c = Math.min(brand.c * spec.ratio * strength, spec.cap * capScale)
  return finalize({ l: lOverride ?? spec.l, c, h: brand.h })
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`
}

interface ModeResult {
  tokens: ThemeTokens
  notes: AnalysisNote[]
}

interface Context {
  brand: Oklch
  options: ThemeOptions
  profile: ContrastProfile
  /** 0 = chromatic brand, 1 = neutral brand. */
  neutrality: number
}

function buildMode(mode: ThemeMode, ctx: Context): ModeResult {
  const { brand, options, profile, neutrality } = ctx
  const isLight = mode === "light"
  const bands = isLight ? LIGHT_SURFACES : DARK_SURFACES
  const tint = options.surfaceTint
  const notes: AnalysisNote[] = []
  const H = brand.h

  // 1. Surface hierarchy: lightness first, then a trace of brand chroma.
  const background = surface(bands.background, brand, tint)
  const card = surface(bands.card, brand, tint)
  const popover = surface(bands.popover, brand, tint)
  const secondary = surface(bands.secondary, brand, tint)
  const muted = surface(bands.muted, brand, tint)
  const accent = surface(bands.accent, brand, options.accentStrength)
  const borderDistance = Math.abs(bands.border.l - bands.background.l) * options.borderStrength
  const borderL = isLight ? background.l - borderDistance : background.l + borderDistance
  const border = surface(bands.border, brand, tint, clamp(borderL, 0, 1))
  const input = surface(bands.border, brand, tint, clamp(borderL + (isLight ? -0.015 : 0.03), 0, 1))
  const sidebar = surface(bands.sidebar, brand, tint)
  const sidebarAccent = surface(bands.sidebarAccent, brand, options.accentStrength)
  const sidebarBorderL = isLight ? sidebar.l - borderDistance * 0.95 : sidebar.l + borderDistance * 0.85
  const sidebarBorder = surface(bands.border, brand, tint, clamp(sidebarBorderL, 0, 1))

  // 2. Content hierarchy. Foreground is checked against every surface it sits on.
  const textDir = isLight ? "darker" : "lighter"
  const fgTint = Math.min(brand.c * 0.06 * tint, 0.012)
  const fg = ensureTextContrast(
    { l: isLight ? profile.fg.light : profile.fg.dark, c: fgTint, h: H },
    [background, card, popover, secondary, muted, accent, sidebar, sidebarAccent],
    profile.text,
    textDir
  ).color
  const mutedFg = ensureTextContrast(
    {
      l: isLight ? profile.mutedFg.light : profile.mutedFg.dark,
      c: Math.min(brand.c * 0.12 * tint, 0.025),
      h: H,
    },
    [background, card, muted],
    profile.muted,
    textDir
  )
  if (mutedFg.adjusted) {
    notes.push({
      label: "Muted foreground",
      value: formatOklch(mutedFg.color),
      detail: `Lightness moved to keep ${mutedFg.ratio.toFixed(2)}:1 against muted and card surfaces.`,
      color: mutedFg.color,
      tone: "adjusted",
    })
  }
  // Slightly more brand in foregrounds that sit on brand-tinted surfaces.
  const brandInk = { l: fg.l, c: Math.min(brand.c * 0.18, 0.03) * Math.max(tint, 0.5), h: H }
  const secondaryFg = ensureTextContrast(brandInk, [secondary], profile.text, textDir).color
  const accentFg = ensureTextContrast(brandInk, [accent], profile.text, textDir).color
  const sidebarAccentFg = ensureTextContrast(brandInk, [sidebarAccent], profile.text, textDir).color

  // 3. Primary.
  let primary: Oklch
  if (isLight) {
    const cusp = cuspLightness(H)
    const upper = 0.7 + clamp((cusp - 0.8) / 0.15, 0, 1) * 0.1 * (1 - neutrality)
    const lower = lerp(0.3, 0.2, neutrality)
    const l = clamp(brand.l, lower, upper)
    primary = finalize({ l, c: brand.c, h: H })
    if (l !== brand.l) {
      notes.push({
        label: "Light primary",
        value: formatOklch(primary),
        detail:
          l > brand.l
            ? `Lightness raised from ${brand.l.toFixed(3)} to ${l.toFixed(3)}; the brand was too dark to read as a distinct filled control.`
            : `Lightness lowered from ${brand.l.toFixed(3)} to ${l.toFixed(3)} (upper bound ${upper.toFixed(2)} for this hue) so controls stand out from light surfaces.`,
        color: primary,
        tone: "adjusted",
      })
    } else {
      notes.push({
        label: "Light primary",
        value: formatOklch(primary),
        detail: "Brand color preserved; it already works as a filled control on light surfaces.",
        color: primary,
        tone: "info",
      })
    }
  } else {
    let l: number
    let reason: string
    const manual = options.darkPrimaryLightness
    if (manual !== null) {
      l = clamp(manual, 0.3, 0.95)
      reason = `Manual dark primary lightness ${l.toFixed(2)}.`
    } else if (brand.l < 0.64) {
      const chromatic = 0.7 + 0.06 * clamp((0.64 - brand.l) / 0.4, 0, 1)
      l = lerp(chromatic, 0.92, neutrality)
      reason =
        neutrality > 0.5
          ? "Near neutral brand: primary flips to a light gray so it reads as the strongest element on dark surfaces."
          : `Primary lightness raised from ${brand.l.toFixed(3)} to ${l.toFixed(3)}; the brand would disappear against dark surfaces.`
    } else {
      const chromatic = clamp(brand.l, 0.64, 0.86)
      l = lerp(chromatic, 0.92, neutrality)
      reason =
        chromatic === brand.l
          ? "Brand is already light enough for dark surfaces; lightness kept."
          : `Lightness clamped from ${brand.l.toFixed(3)} to ${chromatic.toFixed(3)} to avoid glare on dark surfaces.`
    }
    const c = Math.min(brand.c * 0.95, 0.25)
    primary = finalize({ l, c, h: H })
    // Must still read as text (links, text-primary) on the dark background.
    let raised = false
    while (manual === null && contrastRatio(primary, background) < 4.5 && primary.l < 0.9) {
      primary = finalize({ ...primary, l: primary.l + 0.01, c })
      raised = true
    }
    if (raised) reason += ` Raised further to ${primary.l.toFixed(3)} for 4.5:1 against the background.`
    const mapped = c - primary.c > 0.005
    notes.push({
      label: "Dark primary",
      value: formatOklch(primary),
      detail: reason + (mapped ? ` Chroma reduced from ${c.toFixed(3)} to ${primary.c.toFixed(3)} to stay in sRGB.` : ""),
      color: primary,
      tone: primary.l !== brand.l ? "adjusted" : "info",
    })
  }

  const fgOnPrimary = pickForeground(primary, {
    hue: H,
    tint: Math.min(brand.c * 0.3, 0.05),
    target: profile.text,
    allowBackgroundShift: true,
  })
  primary = fgOnPrimary.background
  notes.push({
    label: "Primary foreground",
    value: `${fgOnPrimary.ratio.toFixed(2)}:1`,
    detail:
      fgOnPrimary.reason +
      (fgOnPrimary.backgroundAdjusted
        ? ` Primary lightness nudged to ${primary.l.toFixed(3)} to reach ${profile.text}:1.`
        : ""),
    color: fgOnPrimary.color,
    tone: fgOnPrimary.backgroundAdjusted ? "adjusted" : "info",
  })

  // Ring: a softened primary, used at 50% opacity by shadcn components.
  const ringL = isLight
    ? lerp(clamp(primary.l + 0.15, 0.55, 0.75), 0.708, neutrality)
    : lerp(clamp(primary.l - 0.15, 0.45, 0.62), 0.556, neutrality)
  const ring = finalize({ l: ringL, c: primary.c * 0.8, h: H })

  // 4. Destructive keeps its semantic red hue.
  const baseRed = isLight ? DESTRUCTIVE.light : DESTRUCTIVE.dark
  let destructive = finalize(baseRed)
  const redClash = Math.abs(hueDistance(H, baseRed.h)) < 25 && brand.c >= 0.08
  if (redClash && Math.abs(primary.l - destructive.l) < 0.08) {
    const l = primary.l >= destructive.l ? primary.l - 0.1 : primary.l + 0.1
    destructive = finalize({ ...baseRed, l: clamp(l, 0.4, 0.8) })
    notes.push({
      label: "Destructive",
      value: formatOklch(destructive),
      detail: "Brand hue is close to destructive red; destructive kept red but separated from primary by lightness.",
      color: destructive,
      tone: "adjusted",
    })
  }
  destructive = ensureTextContrast(destructive, [background], isLight ? 4.5 : 4.5, textDir).color

  // 5. Charts: brand first, then controlled hue rotations at compatible L and C.
  const chartC = lerp(clamp(brand.c, 0.09, 0.19), 0.08, neutrality)
  const charts = CHART_OFFSETS.map((offset, i) => {
    if (i === 0) {
      const l = isLight ? clamp(primary.l, 0.45, 0.7) : clamp(primary.l, 0.6, 0.82)
      return finalize({ l, c: Math.max(primary.c, lerp(0, 0.08, neutrality)), h: H })
    }
    const l = isLight ? CHART_LIGHT_L[i] : CHART_DARK_L[i]
    return finalize({ l, c: chartC, h: normalizeHue(H + offset) })
  })

  const tokens: ThemeTokens = {
    background,
    foreground: fg,
    card,
    "card-foreground": fg,
    popover,
    "popover-foreground": fg,
    primary,
    "primary-foreground": fgOnPrimary.color,
    secondary,
    "secondary-foreground": secondaryFg,
    muted,
    "muted-foreground": mutedFg.color,
    accent,
    "accent-foreground": accentFg,
    destructive,
    border,
    input,
    ring,
    "chart-1": charts[0],
    "chart-2": charts[1],
    "chart-3": charts[2],
    "chart-4": charts[3],
    "chart-5": charts[4],
    sidebar,
    "sidebar-foreground": fg,
    "sidebar-primary": primary,
    "sidebar-primary-foreground": fgOnPrimary.color,
    "sidebar-accent": sidebarAccent,
    "sidebar-accent-foreground": sidebarAccentFg,
    "sidebar-border": sidebarBorder,
    "sidebar-ring": ring,
  }

  return { tokens, notes }
}

/** Text and UI pairs that matter for readability, checked in both modes. */
export const CONTRAST_PAIRS: ReadonlyArray<{
  foreground: ColorToken
  background: ColorToken
  kind: ContrastKind
}> = [
  { foreground: "foreground", background: "background", kind: "text" },
  { foreground: "card-foreground", background: "card", kind: "text" },
  { foreground: "popover-foreground", background: "popover", kind: "text" },
  { foreground: "primary-foreground", background: "primary", kind: "text" },
  { foreground: "secondary-foreground", background: "secondary", kind: "text" },
  { foreground: "accent-foreground", background: "accent", kind: "text" },
  { foreground: "muted-foreground", background: "muted", kind: "text" },
  { foreground: "muted-foreground", background: "background", kind: "text" },
  { foreground: "destructive", background: "background", kind: "text" },
  { foreground: "sidebar-foreground", background: "sidebar", kind: "text" },
  { foreground: "sidebar-primary-foreground", background: "sidebar-primary", kind: "text" },
  { foreground: "sidebar-accent-foreground", background: "sidebar-accent", kind: "text" },
  { foreground: "primary", background: "background", kind: "ui" },
]

function runChecks(mode: ThemeMode, tokens: ThemeTokens, profile: ContrastProfile): ContrastCheck[] {
  return CONTRAST_PAIRS.map(({ foreground, background, kind }) => {
    const ratio = contrastRatio(tokens[foreground], tokens[background])
    const target =
      kind === "ui" ? 3 : foreground === "muted-foreground" ? profile.muted : foreground === "destructive" ? 4.5 : profile.text
    return { mode, foreground, background, ratio, target, kind, pass: ratio >= target - 0.005 }
  })
}

/** Normalizes possibly partial or out of range options into a safe set. */
export function resolveOptions(options: Partial<ThemeOptions> = {}): ThemeOptions {
  const o = { ...DEFAULT_OPTIONS, ...options }
  const num = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === "number" && Number.isFinite(v) ? clamp(v, min, max) : fallback
  return {
    surfaceTint: num(o.surfaceTint, DEFAULT_OPTIONS.surfaceTint, 0, 3),
    darkPrimaryLightness:
      o.darkPrimaryLightness === null || o.darkPrimaryLightness === undefined
        ? null
        : num(o.darkPrimaryLightness, 0.72, 0.3, 0.95),
    accentStrength: num(o.accentStrength, DEFAULT_OPTIONS.accentStrength, 0, 3),
    contrast: o.contrast === "soft" || o.contrast === "high" ? o.contrast : "standard",
    borderStrength: num(o.borderStrength, DEFAULT_OPTIONS.borderStrength, 0.3, 2.5),
    radius: num(o.radius, DEFAULT_OPTIONS.radius, 0, 2),
  }
}

/**
 * Generates complete light and dark shadcn themes from one brand color.
 * Pure and deterministic: the same inputs always produce the same output.
 */
export function generateTheme(input: Oklch, partialOptions: Partial<ThemeOptions> = {}): GeneratedTheme {
  const options = resolveOptions(partialOptions)
  const raw: Oklch = {
    l: clamp(Number.isFinite(input.l) ? input.l : 0.5, 0, 1),
    c: Math.max(0, Number.isFinite(input.c) ? input.c : 0),
    h: normalizeHue(input.h),
  }
  const brandWasOutOfGamut = !isInGamut(raw)
  const brand = finalize(raw)
  const neutrality = clamp((NEUTRAL_HIGH - brand.c) / (NEUTRAL_HIGH - NEUTRAL_LOW), 0, 1)
  const profile = CONTRAST[options.contrast]
  const ctx: Context = { brand, options, profile, neutrality }

  const light = buildMode("light", ctx)
  const dark = buildMode("dark", ctx)

  const notes: AnalysisNote[] = [
    {
      label: "Brand",
      value: formatOklch(brand),
      detail: brandWasOutOfGamut
        ? `Input ${formatOklch(raw)} is outside sRGB; chroma was reduced at constant lightness and hue.`
        : "Input is inside the sRGB gamut.",
      color: brand,
      tone: brandWasOutOfGamut ? "adjusted" : "info",
    },
  ]
  if (neutrality > 0) {
    notes.push({
      label: "Neutral brand",
      value: `C ${brand.c.toFixed(3)}`,
      detail:
        neutrality >= 1
          ? "Brand chroma is effectively gray; the theme follows shadcn's neutral structure."
          : "Brand chroma is low; the theme blends toward shadcn's neutral structure.",
      tone: "info",
    })
  }
  notes.push(...light.notes.map((n) => ({ ...n, label: n.label.startsWith("Light") ? n.label : `${n.label} (light)` })))
  notes.push(...dark.notes.map((n) => ({ ...n, label: n.label.startsWith("Dark") ? n.label : `${n.label} (dark)` })))
  notes.push(
    {
      label: "Surface tint",
      value: `${pct(LIGHT_SURFACES.background.ratio * options.surfaceTint)} of brand chroma`,
      detail: `Background chroma ${light.tokens.background.c.toFixed(3)} light / ${dark.tokens.background.c.toFixed(3)} dark. Surfaces differ by lightness; tint stays atmospheric and is capped.`,
      tone: "info",
    },
    {
      label: "Accent",
      value: `${pct(LIGHT_SURFACES.accent.ratio * options.accentStrength)} of brand chroma`,
      detail: `Accent chroma ${light.tokens.accent.c.toFixed(3)} light / ${dark.tokens.accent.c.toFixed(3)} dark, capped at ${(LIGHT_SURFACES.accent.cap * Math.max(1, options.accentStrength)).toFixed(3)}.`,
      tone: "info",
    },
    {
      label: "Charts",
      value: `+${CHART_OFFSETS.slice(1).join("°, +")}°`,
      detail: "Chart 1 carries the brand; the others rotate hue at matched chroma with staggered lightness so series stay distinct in grayscale.",
      tone: "info",
    }
  )

  const checks = [...runChecks("light", light.tokens, profile), ...runChecks("dark", dark.tokens, profile)]
  for (const check of checks) {
    if (!check.pass && check.kind === "ui" && check.foreground === "primary") {
      notes.push({
        label: `Primary on background (${check.mode})`,
        value: `${check.ratio.toFixed(2)}:1`,
        detail:
          "Primary works as a filled control with its foreground, but is below 3:1 as a standalone mark or text. Avoid text-primary for body copy.",
        tone: "warning",
      })
    }
  }

  return {
    light: light.tokens,
    dark: dark.tokens,
    radius: options.radius,
    analysis: { brand, brandWasOutOfGamut, neutralBrand: neutrality >= 1, notes, checks },
  }
}
