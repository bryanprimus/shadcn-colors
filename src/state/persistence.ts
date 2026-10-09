import { resolveOptions } from "@/theme/generate"
import { DEFAULT_OPTIONS, type ContrastPreference, type ThemeOptions } from "@/theme/types"

export type PreviewMode = "light" | "dark" | "split"

export interface LabState {
  brand: string
  options: ThemeOptions
  previewMode: PreviewMode
}

export const DEFAULT_BRAND = "oklch(0.42 0.10 155)"
const STORAGE_KEY = "shadcn-colors:state:v1"

export const DEFAULT_STATE: LabState = {
  brand: DEFAULT_BRAND,
  options: DEFAULT_OPTIONS,
  previewMode: "light",
}

const isPreviewMode = (v: unknown): v is PreviewMode => v === "light" || v === "dark" || v === "split"

/** Short query keys so shared URLs stay readable. */
const PARAMS = {
  brand: "brand",
  mode: "mode",
  surfaceTint: "tint",
  darkPrimaryLightness: "dpl",
  accentStrength: "accent",
  contrast: "contrast",
  borderStrength: "border",
  radius: "radius",
} as const

function fromStorage(): Partial<LabState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Partial<LabState>
    return {
      brand: typeof data.brand === "string" ? data.brand : undefined,
      options: data.options ? resolveOptions(data.options) : undefined,
      previewMode: isPreviewMode(data.previewMode) ? data.previewMode : undefined,
    }
  } catch {
    return {}
  }
}

function fromUrl(): { brand?: string; previewMode?: PreviewMode; options?: Partial<ThemeOptions> } {
  const params = new URLSearchParams(window.location.search)
  if (!params.has(PARAMS.brand)) return {}
  const num = (key: string) => {
    const v = params.get(key)
    if (v === null || v.trim() === "") return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  const options: Partial<ThemeOptions> = {}
  const tint = num(PARAMS.surfaceTint)
  if (tint !== undefined) options.surfaceTint = tint
  const dpl = num(PARAMS.darkPrimaryLightness)
  if (dpl !== undefined) options.darkPrimaryLightness = dpl
  const accent = num(PARAMS.accentStrength)
  if (accent !== undefined) options.accentStrength = accent
  const border = num(PARAMS.borderStrength)
  if (border !== undefined) options.borderStrength = border
  const radius = num(PARAMS.radius)
  if (radius !== undefined) options.radius = radius
  const contrast = params.get(PARAMS.contrast)
  if (contrast) options.contrast = contrast as ContrastPreference
  const mode = params.get(PARAMS.mode)
  return {
    brand: params.get(PARAMS.brand) ?? undefined,
    previewMode: isPreviewMode(mode) ? mode : undefined,
    options,
  }
}

/** URL wins over localStorage so shared links open exactly what was shared. */
export function loadInitialState(): LabState {
  const stored = fromStorage()
  const url = fromUrl()
  if (url.brand) {
    return {
      brand: url.brand,
      options: resolveOptions({ ...DEFAULT_OPTIONS, ...url.options }),
      previewMode: url.previewMode ?? stored.previewMode ?? DEFAULT_STATE.previewMode,
    }
  }
  return {
    brand: stored.brand ?? DEFAULT_STATE.brand,
    options: stored.options ?? DEFAULT_STATE.options,
    previewMode: stored.previewMode ?? DEFAULT_STATE.previewMode,
  }
}

export function buildShareQuery(state: LabState): string {
  const params = new URLSearchParams()
  params.set(PARAMS.brand, state.brand.trim())
  if (state.previewMode !== DEFAULT_STATE.previewMode) params.set(PARAMS.mode, state.previewMode)
  const o = state.options
  const d = DEFAULT_OPTIONS
  if (o.surfaceTint !== d.surfaceTint) params.set(PARAMS.surfaceTint, String(o.surfaceTint))
  if (o.darkPrimaryLightness !== null) params.set(PARAMS.darkPrimaryLightness, String(o.darkPrimaryLightness))
  if (o.accentStrength !== d.accentStrength) params.set(PARAMS.accentStrength, String(o.accentStrength))
  if (o.contrast !== d.contrast) params.set(PARAMS.contrast, o.contrast)
  if (o.borderStrength !== d.borderStrength) params.set(PARAMS.borderStrength, String(o.borderStrength))
  if (o.radius !== d.radius) params.set(PARAMS.radius, String(o.radius))
  return params.toString()
}

export function saveState(state: LabState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode, quota); the URL still carries state.
  }
  const query = buildShareQuery(state)
  const url = `${window.location.pathname}?${query}${window.location.hash}`
  window.history.replaceState(null, "", url)
}
