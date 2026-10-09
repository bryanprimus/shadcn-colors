import { cn } from "@/lib/utils"
import { formatOklch } from "@/theme/color"
import type { Oklch } from "@/theme/types"

/** A color chip rendered directly with OKLCH, with a hairline so light colors stay visible. */
export function Swatch({ color, className }: { color: Oklch | string; className?: string }) {
  const value = typeof color === "string" ? color : formatOklch(color)
  return (
    <span
      aria-hidden
      className={cn("inline-block size-4 shrink-0 rounded-[4px] shadow-[inset_0_0_0_1px_rgb(128_128_128/0.35)]", className)}
      style={{ background: value }}
    />
  )
}
