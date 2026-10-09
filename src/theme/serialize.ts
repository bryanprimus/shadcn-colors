import { formatOklch } from "./color"
import {
  COLOR_TOKENS,
  type ColorToken,
  type GeneratedTheme,
  type ThemeMode,
  type ThemeTokens,
} from "./types"

/*
 * Mirrors the index.css the current shadcn CLI writes for a Vite project
 * (shadcn 4.x, Tailwind v4): imports, the dark custom variant, the
 * `@theme inline` mapping, :root and .dark variables, and the base layer.
 */

export interface SerializeOptions {
  /** Include the Geist font import and --font-sans, as a default init does. */
  includeFont?: boolean
  /** Optional comment lines placed at the top of the file. */
  header?: string[]
}

export function formatRadius(rem: number): string {
  const rounded = Math.round(rem * 1000) / 1000
  return `${rounded}rem`
}

/** The `--name: value;` lines for one mode, in shadcn order. */
export function tokenLines(tokens: ThemeTokens, radius?: number): string[] {
  const lines: string[] = []
  for (const name of COLOR_TOKENS) {
    lines.push(`--${name}: ${formatOklch(tokens[name])};`)
    // shadcn places --radius after the chart colors in :root.
    if (name === "chart-5" && radius !== undefined) lines.push(`--radius: ${formatRadius(radius)};`)
  }
  return lines
}

export function serializeBlock(selector: string, lines: string[]): string {
  return `${selector} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`
}

/** Just the variables for one mode, e.g. for "Copy light tokens". */
export function serializeMode(theme: GeneratedTheme, mode: ThemeMode): string {
  return mode === "light"
    ? serializeBlock(":root", tokenLines(theme.light, theme.radius))
    : serializeBlock(".dark", tokenLines(theme.dark))
}

const RADIUS_SCALE: ReadonlyArray<[string, string]> = [
  ["sm", "calc(var(--radius) * 0.6)"],
  ["md", "calc(var(--radius) * 0.8)"],
  ["lg", "var(--radius)"],
  ["xl", "calc(var(--radius) * 1.4)"],
  ["2xl", "calc(var(--radius) * 1.8)"],
  ["3xl", "calc(var(--radius) * 2.2)"],
  ["4xl", "calc(var(--radius) * 2.6)"],
]

function themeInline(includeFont: boolean): string {
  const lines: string[] = []
  if (includeFont) lines.push(`--font-sans: 'Geist Variable', sans-serif;`)
  lines.push("--font-heading: var(--font-sans);")
  for (const name of COLOR_TOKENS) lines.push(`--color-${name}: var(--${name});`)
  for (const [size, value] of RADIUS_SCALE) lines.push(`--radius-${size}: ${value};`)
  return serializeBlock("@theme inline", lines)
}

const BASE_LAYER = `@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}`

/** Complete globals.css (index.css in Vite) ready to paste into a shadcn project. */
export function serializeGlobalsCss(theme: GeneratedTheme, options: SerializeOptions = {}): string {
  const includeFont = options.includeFont ?? true
  const imports = [
    `@import "tailwindcss";`,
    `@import "tw-animate-css";`,
    `@import "shadcn/tailwind.css";`,
    ...(includeFont ? [`@import "@fontsource-variable/geist";`] : []),
  ]
  const header = options.header?.length
    ? `/*\n${options.header.map((l) => ` * ${l}`).join("\n")}\n */\n\n`
    : ""
  return (
    header +
    [
      imports.join("\n"),
      "@custom-variant dark (&:is(.dark *));",
      themeInline(includeFont),
      serializeMode(theme, "light"),
      serializeMode(theme, "dark"),
      BASE_LAYER,
    ].join("\n\n") +
    "\n"
  )
}

/** CSS custom properties for applying a mode to a preview element via style. */
export function toCssVariables(tokens: ThemeTokens, radius: number): Record<`--${ColorToken | "radius"}`, string> {
  const vars = {} as Record<`--${ColorToken | "radius"}`, string>
  for (const name of COLOR_TOKENS) vars[`--${name}`] = formatOklch(tokens[name])
  vars["--radius"] = formatRadius(radius)
  return vars
}
