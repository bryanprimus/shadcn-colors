import { AlertTriangleIcon, CheckIcon, SlidersHorizontalIcon } from "lucide-react"

import { Swatch } from "@/components/editor/swatch"
import { cn } from "@/lib/utils"
import { useThemeLab } from "@/state/theme-lab"
import { formatOklch } from "@/theme/color"

export function AnalysisPanel() {
  const { theme } = useThemeLab()
  const { notes, checks } = theme.analysis
  const textChecks = checks.filter((c) => c.kind === "text")
  const passing = textChecks.filter((c) => c.pass).length

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1.5">
        {(["light", "dark"] as const).map((mode) => {
          const primary = theme[mode].primary
          const fg = theme[mode]["primary-foreground"]
          const ratio = checks.find((c) => c.mode === mode && c.foreground === "primary-foreground")?.ratio ?? 0
          return (
            <div
              key={mode}
              className="flex flex-col gap-2 rounded-md border p-2"
              style={{ background: formatOklch(theme[mode].background) }}
            >
              <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: formatOklch(theme[mode]["muted-foreground"]) }}>{mode} primary</span>
              <div
                className="flex h-9 items-center justify-center rounded-md text-xs font-medium"
                style={{ background: formatOklch(primary), color: formatOklch(fg) }}
              >
                Button · {ratio.toFixed(2)}:1
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {passing === textChecks.length ? <CheckIcon className="size-3.5 text-emerald-500" /> : <AlertTriangleIcon className="size-3.5 text-amber-500" />}
        {passing} of {textChecks.length} text pairs meet their contrast target.
      </div>
      <ol className="flex flex-col divide-y rounded-md border">
        {notes.map((n, i) => (
          <li key={`${n.label}-${i}`} className="flex flex-col gap-1 px-2.5 py-2">
            <div className="flex items-center gap-2">
              {n.color && <Swatch color={n.color} className="size-3.5" />}
              <span className="text-xs font-medium">{n.label}</span>
              {n.tone === "adjusted" && <SlidersHorizontalIcon className="text-muted-foreground size-3" aria-label="adjusted" />}
              {n.tone === "warning" && <AlertTriangleIcon className="size-3 text-amber-500" aria-label="warning" />}
              {n.value && <span className="text-muted-foreground ml-auto truncate font-mono text-[10px]">{n.value}</span>}
            </div>
            <p className={cn("text-muted-foreground text-[11px] leading-snug", n.tone === "warning" && "text-amber-600 dark:text-amber-400")}>
              {n.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
