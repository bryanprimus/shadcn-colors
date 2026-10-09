import * as React from "react"
import { AlertTriangleIcon, CheckIcon, DicesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Swatch } from "@/components/editor/swatch"
import { cn } from "@/lib/utils"
import { useThemeLab } from "@/state/theme-lab"
import { formatOklch } from "@/theme/color"
import { mapToGamut } from "@/theme/gamut"
import { parseBrandColor } from "@/theme/parse"

export const EXAMPLES = [
  { name: "Forest", value: "oklch(0.42 0.10 155)" },
  { name: "Bright green", value: "oklch(0.80 0.22 145)" },
  { name: "Deep blue", value: "oklch(0.38 0.16 262)" },
  { name: "Violet", value: "oklch(0.55 0.25 295)" },
  { name: "Red", value: "oklch(0.58 0.22 25)" },
  { name: "Orange", value: "oklch(0.70 0.19 48)" },
  { name: "Yellow", value: "oklch(0.90 0.18 100)" },
  { name: "Cyan", value: "oklch(0.78 0.13 210)" },
  { name: "Slate", value: "oklch(0.48 0.02 250)" },
  { name: "Midnight", value: "oklch(0.20 0.06 270)" },
  { name: "Blush", value: "oklch(0.88 0.06 350)" },
  { name: "Gamut buster", value: "oklch(0.70 0.37 330)" },
]

function randomBrand(): string {
  const l = 0.32 + Math.random() * 0.5
  const h = Math.random() * 360
  const c = 0.05 + Math.random() * 0.2
  const mapped = mapToGamut({ l, c, h })
  return formatOklch({ ...mapped, c: mapped.c * 0.97 })
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 flex flex-col gap-0.5 rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">{label}</span>
      <span className="font-mono text-xs tabular-nums">{value}</span>
    </div>
  )
}

/** Small slider that nudges one OKLCH channel of the brand and writes it back to the input. */
function Nudge({
  label,
  value,
  min,
  max,
  step,
  onChange,
  track,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  track: string
}) {
  return (
    <div className="grid grid-cols-[1rem_1fr] items-center gap-2">
      <span className="text-muted-foreground font-mono text-[10px]">{label}</span>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ background: track }} />
        <Slider
          aria-label={`Brand ${label}`}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
          className="relative [&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-track]]:bg-transparent"
        />
      </div>
    </div>
  )
}

export function BrandControls() {
  const { brandInput, setBrandInput, parsed, brand } = useThemeLab()
  const id = React.useId()
  const set = (patch: Partial<typeof brand>) => setBrandInput(formatOklch({ ...brand, ...patch }))

  const hueTrack = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
    .map((h) => `oklch(${brand.l} ${Math.min(brand.c, 0.15)} ${h})`)
    .join(", ")})`
  const lightTrack = `linear-gradient(to right, oklch(0.05 ${brand.c} ${brand.h}), oklch(0.5 ${brand.c} ${brand.h}), oklch(0.98 ${brand.c} ${brand.h}))`
  const chromaTrack = `linear-gradient(to right, oklch(${brand.l} 0 ${brand.h}), oklch(${brand.l} 0.37 ${brand.h}))`

  return (
    <div className="flex flex-col gap-4">
      <Field data-invalid={!parsed.ok || undefined}>
        <FieldLabel htmlFor={`${id}-brand`}>Brand color</FieldLabel>
        <InputGroup className="h-9">
          <InputGroupAddon>
            <Swatch color={brand} className={cn("size-5", !parsed.ok && "opacity-40")} />
          </InputGroupAddon>
          <InputGroupInput
            id={`${id}-brand`}
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={!parsed.ok}
            className="font-mono text-xs"
            placeholder="oklch(0.42 0.10 155)"
          />
          <InputGroupAddon align="inline-end">
            {parsed.ok ? (
              parsed.inGamut ? (
                <CheckIcon className="text-emerald-500" aria-label="Valid" />
              ) : (
                <Tooltip>
                  <TooltipTrigger render={<span className="inline-flex" />}>
                    <AlertTriangleIcon className="text-amber-500" aria-label="Out of sRGB gamut" />
                  </TooltipTrigger>
                  <TooltipContent>Outside sRGB. Chroma is reduced at constant L and H.</TooltipContent>
                </Tooltip>
              )
            ) : null}
          </InputGroupAddon>
        </InputGroup>
        {parsed.ok ? (
          <FieldDescription className="text-xs">
            Parsed as {parsed.source}. Accepts <code className="font-mono">oklch()</code>, bare <code className="font-mono">L C H</code>, hex or rgb.
          </FieldDescription>
        ) : (
          <FieldError className="text-xs">{parsed.error} Preview keeps the last valid color.</FieldError>
        )}
      </Field>

      <div className="flex gap-3">
        <div
          className="size-[68px] shrink-0 rounded-lg shadow-[inset_0_0_0_1px_rgb(128_128_128/0.35)]"
          style={{ background: formatOklch(brand) }}
          aria-label="Brand swatch"
          role="img"
        />
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          <Readout label="L" value={brand.l.toFixed(3)} />
          <Readout label="C" value={brand.c.toFixed(3)} />
          <Readout label="H" value={brand.h.toFixed(1)} />
          <div className="bg-muted/40 col-span-3 flex items-center justify-between gap-2 rounded-md border px-2 py-1">
            <span className="truncate font-mono text-[11px]">{formatOklch(brand)}</span>
            {parsed.ok && !parsed.inGamut && (
              <Badge variant="outline" className="h-4 border-amber-500/40 px-1 text-[9px] text-amber-500">
                P3+
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Nudge label="L" value={brand.l} min={0} max={1} step={0.005} onChange={(l) => set({ l })} track={lightTrack} />
        <Nudge label="C" value={brand.c} min={0} max={0.37} step={0.002} onChange={(c) => set({ c })} track={chromaTrack} />
        <Nudge label="H" value={brand.h} min={0} max={359.9} step={0.5} onChange={(h) => set({ h })} track={hueTrack} />
      </div>
    </div>
  )
}

export function ExampleBrands() {
  const { setBrandInput, brand } = useThemeLab()
  const current = formatOklch(brand)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">Examples</span>
        <Button variant="ghost" size="xs" onClick={() => setBrandInput(randomBrand())}>
          <DicesIcon data-icon="inline-start" />
          Random brand
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {EXAMPLES.map((e) => {
          const r = parseBrandColor(e.value)
          const active = r.ok && r.normalized === current
          return (
            <Tooltip key={e.name}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setBrandInput(e.value)}
                    aria-label={`${e.name} ${e.value}`}
                    className={cn(
                      "focus-visible:ring-ring/50 aspect-square rounded-md shadow-[inset_0_0_0_1px_rgb(128_128_128/0.35)] transition-transform outline-none hover:scale-105 focus-visible:ring-3",
                      active && "ring-foreground ring-2 ring-offset-2 ring-offset-background"
                    )}
                    style={{ background: e.value }}
                  />
                }
              />
              <TooltipContent>
                {e.name} <span className="font-mono opacity-70">{e.value}</span>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
