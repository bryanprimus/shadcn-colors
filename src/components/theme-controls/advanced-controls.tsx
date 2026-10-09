import * as React from "react"
import { ChevronRightIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useThemeLab } from "@/state/theme-lab"
import { DEFAULT_OPTIONS, type ContrastPreference } from "@/theme/types"

function SliderRow({
  label,
  hint,
  value,
  display,
  min,
  max,
  step,
  onChange,
  disabled,
  isDefault,
}: {
  label: string
  hint: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
  isDefault: boolean
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-2" data-disabled={disabled || undefined}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs">
          {label}
          {!isDefault && <span className="bg-primary size-1.5 rounded-full" aria-label="modified" />}
        </Label>
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">{display}</span>
      </div>
      <Slider
        id={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
      <p className="text-muted-foreground text-[11px] leading-snug">{hint}</p>
    </div>
  )
}

export function AdvancedControls() {
  const { options, setOption, resetOptions, theme } = useThemeLab()
  const [open, setOpen] = React.useState(true)
  const autoDark = options.darkPrimaryLightness === null
  const modified = JSON.stringify(options) !== JSON.stringify(DEFAULT_OPTIONS)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger render={<Button variant="ghost" size="xs" className="-ml-2 text-xs font-medium" />}>
          <ChevronRightIcon data-icon="inline-start" className={open ? "rotate-90 transition-transform" : "transition-transform"} />
          Advanced
        </CollapsibleTrigger>
        <Button variant="outline" size="xs" onClick={resetOptions} disabled={!modified}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset to formula
        </Button>
      </div>
      <CollapsibleContent className="flex flex-col gap-5">
        <SliderRow
          label="Surface tint"
          hint="Share of brand chroma injected into neutral surfaces. Capped so the UI never turns monochrome."
          value={options.surfaceTint}
          display={`${Math.round(options.surfaceTint * 4.5)}% of C`}
          min={0}
          max={3}
          step={0.05}
          onChange={(v) => setOption("surfaceTint", v)}
          isDefault={options.surfaceTint === DEFAULT_OPTIONS.surfaceTint}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-dark" className="text-xs">
              Automatic dark primary
            </Label>
            <Switch
              id="auto-dark"
              size="sm"
              checked={autoDark}
              onCheckedChange={(checked) =>
                setOption("darkPrimaryLightness", checked ? null : Math.round(theme.dark.primary.l * 100) / 100)
              }
            />
          </div>
          <SliderRow
            label="Dark primary lightness"
            hint={autoDark ? "Chosen by the engine from brand lightness and contrast." : "Manual override. Foreground still adapts."}
            value={options.darkPrimaryLightness ?? theme.dark.primary.l}
            display={`L ${(options.darkPrimaryLightness ?? theme.dark.primary.l).toFixed(2)}`}
            min={0.4}
            max={0.92}
            step={0.01}
            disabled={autoDark}
            onChange={(v) => setOption("darkPrimaryLightness", v)}
            isDefault={autoDark}
          />
        </div>
        <SliderRow
          label="Accent strength"
          hint="Brand chroma in accent surfaces (hovered menu items, ghost buttons)."
          value={options.accentStrength}
          display={`${Math.round(options.accentStrength * 30)}% of C`}
          min={0}
          max={3}
          step={0.05}
          onChange={(v) => setOption("accentStrength", v)}
          isDefault={options.accentStrength === DEFAULT_OPTIONS.accentStrength}
        />
        <div className="flex flex-col gap-2">
          <Label className="text-xs">
            Contrast
            {options.contrast !== "standard" && <span className="bg-primary size-1.5 rounded-full" aria-label="modified" />}
          </Label>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[options.contrast]}
            onValueChange={(v) => v[0] && setOption("contrast", v[0] as ContrastPreference)}
            className="w-full"
          >
            <ToggleGroupItem value="soft" className="flex-1 text-xs">Soft</ToggleGroupItem>
            <ToggleGroupItem value="standard" className="flex-1 text-xs">AA</ToggleGroupItem>
            <ToggleGroupItem value="high" className="flex-1 text-xs">AAA</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-[11px] leading-snug">
            {options.contrast === "soft"
              ? "Text 4.5:1, muted text 3:1. Softer hierarchy; muted text fails AA for small copy."
              : options.contrast === "high"
                ? "Text 7:1 (AAA), muted text 5.5:1. Primary may shift to reach it."
                : "Text 4.5:1 and muted text 4.5:1 (WCAG AA)."}
          </p>
        </div>
        <SliderRow
          label="Border strength"
          hint="Lightness distance between background and border, input and sidebar border."
          value={options.borderStrength}
          display={`${options.borderStrength.toFixed(2)}×`}
          min={0.3}
          max={2.5}
          step={0.05}
          onChange={(v) => setOption("borderStrength", v)}
          isDefault={options.borderStrength === DEFAULT_OPTIONS.borderStrength}
        />
        <SliderRow
          label="Radius"
          hint="Base --radius. shadcn derives sm through 4xl from it."
          value={options.radius}
          display={`${options.radius}rem`}
          min={0}
          max={1.25}
          step={0.125}
          onChange={(v) => setOption("radius", v)}
          isDefault={options.radius === DEFAULT_OPTIONS.radius}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
