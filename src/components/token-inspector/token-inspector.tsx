import * as React from "react"
import { AlertTriangleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Swatch } from "@/components/editor/swatch"
import { copyText } from "@/lib/clipboard"
import { cn } from "@/lib/utils"
import { useThemeLab } from "@/state/theme-lab"
import { formatOklch } from "@/theme/color"
import type { ColorToken, ContrastCheck, ThemeMode } from "@/theme/types"

const GROUPS: { name: string; tokens: ColorToken[] }[] = [
  { name: "Surfaces", tokens: ["background", "card", "popover", "secondary", "muted", "accent"] },
  {
    name: "Content",
    tokens: ["foreground", "card-foreground", "popover-foreground", "secondary-foreground", "muted-foreground", "accent-foreground"],
  },
  { name: "Brand", tokens: ["primary", "primary-foreground"] },
  { name: "Controls", tokens: ["ring", "input", "destructive"] },
  { name: "Borders", tokens: ["border", "input"] },
  { name: "Charts", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  {
    name: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
]

function checkLabel(c: ContrastCheck) {
  return `${c.foreground} on ${c.background}: ${c.ratio.toFixed(2)}:1 (target ${c.target}:1)`
}

export function TokenInspector({ mode, onModeChange }: { mode: ThemeMode; onModeChange: (m: ThemeMode) => void }) {
  const { theme } = useThemeLab()
  const tokens = theme[mode]
  const checks = theme.analysis.checks.filter((c) => c.mode === mode)
  const failing = checks.filter((c) => !c.pass && c.kind === "text")
  const byFg = React.useMemo(() => {
    const map = new Map<ColorToken, ContrastCheck>()
    for (const c of checks) if (!map.has(c.foreground)) map.set(c.foreground, c)
    return map
  }, [checks])
  const involved = (t: ColorToken) => checks.filter((c) => !c.pass && (c.foreground === t || c.background === t))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Tabs value={mode} onValueChange={(v) => onModeChange(v as ThemeMode)}>
          <TabsList className="h-7">
            <TabsTrigger value="light" className="text-xs">:root</TabsTrigger>
            <TabsTrigger value="dark" className="text-xs">.dark</TabsTrigger>
          </TabsList>
        </Tabs>
        {failing.length > 0 ? (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangleIcon /> {failing.length} text pair{failing.length > 1 ? "s" : ""} below target
          </Badge>
        ) : (
          <Badge variant="secondary">All text pairs pass</Badge>
        )}
      </div>
      <p className="text-muted-foreground text-[11px]">Click a value to copy it.</p>
      {GROUPS.map((group) => (
        <div key={group.name} className="flex flex-col">
          <span className="text-muted-foreground px-1 pb-1 text-[10px] font-medium tracking-wider uppercase">{group.name}</span>
          <div className="divide-y rounded-md border">
            {group.tokens.map((t) => {
              const value = formatOklch(tokens[t])
              const check = byFg.get(t)
              const problems = involved(t)
              return (
                <button
                  key={`${group.name}-${t}`}
                  type="button"
                  onClick={() => copyText(value, `--${t} copied`)}
                  className="hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-ring/50 flex w-full items-center gap-2 px-2 py-1.5 text-left outline-none first:rounded-t-md last:rounded-b-md focus-visible:ring-2"
                >
                  <Swatch color={tokens[t]} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px]">--{t}</span>
                  {check && (
                    <Tooltip>
                      <TooltipTrigger render={<span />}>
                        <span
                          className={cn(
                            "rounded px-1 font-mono text-[10px] tabular-nums",
                            check.pass ? "text-muted-foreground" : "bg-destructive/15 text-destructive"
                          )}
                        >
                          {check.ratio.toFixed(1)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{checkLabel(check)}</TooltipContent>
                    </Tooltip>
                  )}
                  {problems.length > 0 && !check && (
                    <Tooltip>
                      <TooltipTrigger render={<span className="inline-flex" />}>
                        <AlertTriangleIcon className="text-destructive size-3.5" />
                      </TooltipTrigger>
                      <TooltipContent>{problems.map(checkLabel).join(" · ")}</TooltipContent>
                    </Tooltip>
                  )}
                  <span className="text-muted-foreground font-mono text-[10px] tabular-nums">{value.slice(6, -1)}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
