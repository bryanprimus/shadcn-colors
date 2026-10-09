import * as React from "react"
import { CopyIcon, DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { copyText } from "@/lib/clipboard"
import { useThemeLab } from "@/state/theme-lab"
import { serializeMode } from "@/theme/serialize"

/** Minimal CSS highlighting: selectors/at-rules, property names, oklch values and comments. */
function highlight(css: string): React.ReactNode[] {
  return css.split("\n").map((line, i) => {
    let node: React.ReactNode = line
    const trimmed = line.trim()
    if (trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      node = <span className="text-muted-foreground/70 italic">{line}</span>
    } else if (/^\s*--[\w-]+:/.test(line)) {
      const [, indent, prop, rest] = /^(\s*)(--[\w-]+:)(.*)$/.exec(line) ?? []
      node = (
        <>
          {indent}
          <span className="text-sky-600 dark:text-sky-300">{prop}</span>
          <span className="text-foreground">{rest}</span>
        </>
      )
    } else if (/^\s*@/.test(line) || /^[.:*\w][^:]*\{\s*$/.test(trimmed)) {
      node = <span className="text-violet-600 dark:text-violet-300">{line}</span>
    }
    return (
      <div key={i} className="min-h-[1lh] whitespace-pre">
        {node}
      </div>
    )
  })
}

export function CodeOutput() {
  const { css, theme, includeFont, setIncludeFont } = useThemeLab()
  const lines = React.useMemo(() => highlight(css), [css])

  const download = () => {
    const url = URL.createObjectURL(new Blob([css], { type: "text/css" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "globals.css"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => copyText(css, "globals.css copied")}>
          <CopyIcon data-icon="inline-start" />
          Copy globals.css
        </Button>
        <ButtonGroup>
          <Button size="sm" variant="outline" onClick={() => copyText(serializeMode(theme, "light"), "Light tokens copied")}>
            Light tokens
          </Button>
          <Button size="sm" variant="outline" onClick={() => copyText(serializeMode(theme, "dark"), "Dark tokens copied")}>
            Dark tokens
          </Button>
        </ButtonGroup>
        <Button size="icon-sm" variant="ghost" onClick={download} aria-label="Download globals.css">
          <DownloadIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="include-font" size="sm" checked={includeFont} onCheckedChange={setIncludeFont} />
        <Label htmlFor="include-font" className="text-muted-foreground text-[11px] font-normal">
          Include Geist font lines (matches a default <code className="font-mono">shadcn init</code>)
        </Label>
      </div>
      <ScrollArea className="bg-muted/30 min-h-0 flex-1 rounded-md border">
        <pre className="p-3 font-mono text-[11px] leading-[1.6]" aria-label="Generated globals.css">
          <code>{lines}</code>
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
