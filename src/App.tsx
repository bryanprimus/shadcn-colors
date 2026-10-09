import * as React from "react"
import {
  CodeIcon,
  CopyIcon,
  LinkIcon,
  MoonIcon,
  PanelLeftIcon,
  SunIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { CodeOutput } from "@/components/code-output/code-output"
import { PreviewCanvas } from "@/components/editor/preview-canvas"
import { Swatch } from "@/components/editor/swatch"
import { AnalysisPanel } from "@/components/theme-analysis/analysis-panel"
import { AdvancedControls } from "@/components/theme-controls/advanced-controls"
import { BrandControls, ExampleBrands } from "@/components/theme-controls/brand-controls"
import { TokenInspector } from "@/components/token-inspector/token-inspector"
import { copyText } from "@/lib/clipboard"
import type { PreviewMode } from "@/state/persistence"
import { useThemeLab } from "@/state/theme-lab"
import type { ThemeMode } from "@/theme/types"

function useShellTheme() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"))
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    try {
      localStorage.setItem("shadcn-colors:shell", dark ? "dark" : "light")
    } catch {
      // ignore unavailable storage
    }
  }, [dark])
  return [dark, setDark] as const
}

function ControlsPanel() {
  return (
    <div className="flex flex-col gap-5 p-4">
      <BrandControls />
      <ExampleBrands />
      <Separator />
      <AdvancedControls />
    </div>
  )
}

function OutputPanel() {
  const { previewMode } = useThemeLab()
  const [tab, setTab] = React.useState("tokens")
  const [inspectMode, setInspectMode] = React.useState<ThemeMode>(previewMode === "dark" ? "dark" : "light")
  // Follow the preview when it switches between light and dark.
  const [lastPreview, setLastPreview] = React.useState(previewMode)
  if (previewMode !== lastPreview) {
    setLastPreview(previewMode)
    if (previewMode !== "split") setInspectMode(previewMode)
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="flex min-h-0 flex-1 flex-col gap-0">
      <div className="border-b px-3 py-2">
        <TabsList className="w-full">
          <TabsTrigger value="tokens" className="text-xs">Tokens</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
          <TabsTrigger value="css" className="text-xs">globals.css</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="tokens" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-3">
            <TokenInspector mode={inspectMode} onModeChange={setInspectMode} />
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="analysis" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-3">
            <AnalysisPanel />
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="css" className="flex min-h-0 flex-1 flex-col p-3">
        <CodeOutput />
      </TabsContent>
    </Tabs>
  )
}

function Header({
  onOpenControls,
  onOpenOutput,
  dark,
  onToggleDark,
}: {
  onOpenControls: () => void
  onOpenOutput: () => void
  dark: boolean
  onToggleDark: () => void
}) {
  const { previewMode, setPreviewMode, css, brand } = useThemeLab()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
      <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onOpenControls} aria-label="Open theme controls">
        <PanelLeftIcon />
      </Button>
      <div className="flex items-center gap-2">
        <Swatch color={brand} className="size-5 rounded-md" />
        <span className="hidden text-sm font-semibold tracking-tight whitespace-nowrap sm:inline">shadcn colors</span>
        <span className="text-muted-foreground hidden font-mono text-[11px] md:inline">theme lab</span>
      </div>
      <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
      <ToggleGroup
        variant="outline"
        size="sm"
        spacing={0}
        value={[previewMode]}
        onValueChange={(v) => v[0] && setPreviewMode(v[0] as PreviewMode)}
        aria-label="Preview mode"
      >
        <ToggleGroupItem value="light" className="text-xs">
          <SunIcon />
          <span className="hidden sm:inline">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" className="text-xs">
          <MoonIcon />
          <span className="hidden sm:inline">Dark</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="split" className="text-xs">
          <span className="font-mono">◐</span>
          <span className="hidden sm:inline">Light | Dark</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden sm:inline-flex"
                aria-label="Copy share link"
                onClick={() => copyText(window.location.href, "Share link copied")}
              />
            }
          >
            <LinkIcon />
          </TooltipTrigger>
          <TooltipContent>Copy share link</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Toggle editor theme" onClick={onToggleDark} />}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </TooltipTrigger>
          <TooltipContent>Editor theme (does not affect the preview)</TooltipContent>
        </Tooltip>
        <Button variant="outline" size="sm" className="xl:hidden" onClick={onOpenOutput}>
          <CodeIcon data-icon="inline-start" />
          <span className="hidden sm:inline">Tokens</span>
        </Button>
        <Button size="sm" onClick={() => copyText(css, "globals.css copied")}>
          <CopyIcon data-icon="inline-start" />
          <span className="hidden sm:inline">Copy globals.css</span>
          <span className="sm:hidden">Copy</span>
        </Button>
      </div>
    </header>
  )
}

export default function App() {
  const [controlsOpen, setControlsOpen] = React.useState(false)
  const [outputOpen, setOutputOpen] = React.useState(false)
  const [shellDark, setShellDark] = useShellTheme()

  return (
    <div className="bg-background text-foreground flex h-full flex-col">
      <Header
        onOpenControls={() => setControlsOpen(true)}
        onOpenOutput={() => setOutputOpen(true)}
        dark={shellDark}
        onToggleDark={() => setShellDark((d) => !d)}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[300px] shrink-0 flex-col border-r lg:flex" aria-label="Theme controls">
          <ScrollArea className="min-h-0 flex-1">
            <ControlsPanel />
          </ScrollArea>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col" aria-label="Component preview">
          <PreviewCanvas />
        </main>
        <aside className="hidden w-[360px] shrink-0 flex-col border-l xl:flex" aria-label="Generated theme">
          <OutputPanel />
        </aside>
      </div>

      <Sheet open={controlsOpen} onOpenChange={setControlsOpen}>
        <SheetContent side="left" className="w-[320px] gap-0 p-0 sm:max-w-[320px]">
          <SheetHeader className="border-b">
            <SheetTitle>Theme controls</SheetTitle>
            <SheetDescription>Brand color and advanced options.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="min-h-0 flex-1">
            <ControlsPanel />
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Sheet open={outputOpen} onOpenChange={setOutputOpen}>
        <SheetContent side="right" className="flex w-[380px] flex-col gap-0 p-0 sm:max-w-[380px]">
          <SheetHeader className="border-b">
            <SheetTitle>Generated theme</SheetTitle>
            <SheetDescription>Tokens, analysis and globals.css.</SheetDescription>
          </SheetHeader>
          <OutputPanel />
        </SheetContent>
      </Sheet>
      <Toaster position="bottom-center" theme={shellDark ? "dark" : "light"} />
    </div>
  )
}
