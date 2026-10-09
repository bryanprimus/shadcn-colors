/** A color in OKLCH. `l` is 0..1, `c` is >= 0, `h` is degrees in [0, 360). */
export interface Oklch {
  readonly l: number
  readonly c: number
  readonly h: number
}

/**
 * Every color token shadcn's current globals.css defines, in the exact order the
 * shadcn CLI writes them. `radius` is handled separately because it is a length.
 */
export const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const

export type ColorToken = (typeof COLOR_TOKENS)[number]

/** A complete set of semantic colors for one mode. */
export type ThemeTokens = { readonly [K in ColorToken]: Oklch }

export type ThemeMode = "light" | "dark"

export type ContrastPreference = "soft" | "standard" | "high"

export interface ThemeOptions {
  /** Multiplier on brand chroma used for neutral surfaces. 0 = pure gray, 1 = default. */
  surfaceTint: number
  /** Manual dark mode primary lightness, or null for automatic. */
  darkPrimaryLightness: number | null
  /** Multiplier on the brand chroma injected into accent surfaces. */
  accentStrength: number
  /** Text contrast targets. */
  contrast: ContrastPreference
  /** Multiplier on the lightness distance between background and border. */
  borderStrength: number
  /** Base radius in rem. */
  radius: number
}

export const DEFAULT_OPTIONS: ThemeOptions = {
  surfaceTint: 1,
  darkPrimaryLightness: null,
  accentStrength: 1,
  contrast: "standard",
  borderStrength: 1,
  radius: 0.625,
}

export type ContrastKind = "text" | "ui"

export interface ContrastCheck {
  mode: ThemeMode
  foreground: ColorToken
  background: ColorToken
  ratio: number
  target: number
  kind: ContrastKind
  pass: boolean
}

export interface AnalysisNote {
  label: string
  value?: string
  detail: string
  /** Optional swatch rendered beside the note. */
  color?: Oklch
  tone?: "info" | "adjusted" | "warning"
}

export interface ThemeAnalysis {
  brand: Oklch
  brandWasOutOfGamut: boolean
  /** Brand chroma considered "effectively neutral". */
  neutralBrand: boolean
  notes: AnalysisNote[]
  checks: ContrastCheck[]
}

export interface GeneratedTheme {
  light: ThemeTokens
  dark: ThemeTokens
  radius: number
  analysis: ThemeAnalysis
}
