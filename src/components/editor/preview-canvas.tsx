import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Gallery } from "@/components/component-gallery/gallery"
import { CATEGORIES, SECTIONS, searchSections } from "@/components/component-gallery/sections"
import { PreviewRoot } from "@/components/preview/preview-root"
import { cn } from "@/lib/utils"
import { useThemeLab } from "@/state/theme-lab"

const ANCHOR = "preview-"

export function PreviewCanvas() {
  const { theme, previewMode } = useThemeLab()
  const [query, setQuery] = React.useState("")
  const deferredQuery = React.useDeferredValue(query)
  const sections = React.useMemo(() => searchSections(deferredQuery), [deferredQuery])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

  // "/" or ⌘K focuses component search, like most design tools.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const editable = target?.closest("input, textarea, select, [contenteditable='true']")
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !editable)) {
        // Leave ⌘K alone when focus is inside a preview (its command palette demo).
        if (target?.closest("[data-preview-root]")) return
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const jumpTo = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${ANCHOR}${id}`)
    if (!container || !el) return
    // Scroll only the canvas; scrollIntoView would also scroll outer elements.
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 8
    container.scrollTo({ top, behavior: "smooth" })
  }

  const jumpToCategory = (category: string) => {
    setActiveCategory(category)
    const first = sections.find((s) => s.category === category)
    if (first) jumpTo(first.id)
  }

  const visibleCategories = CATEGORIES.filter((c) => sections.some((s) => s.category === c))

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="bg-background flex flex-col gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <InputGroup className="h-8 max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && sections[0]) jumpTo(sections[0].id)
                if (e.key === "Escape") setQuery("")
              }}
              placeholder="Search components: button, dialog, input…"
              aria-label="Search components"
              className="text-xs"
            />
            <InputGroupAddon align="inline-end">
              {query ? (
                <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery("")}>
                  <XIcon />
                </InputGroupButton>
              ) : (
                <Kbd>/</Kbd>
              )}
            </InputGroupAddon>
          </InputGroup>
          <span className="text-muted-foreground hidden font-mono text-[11px] whitespace-nowrap sm:inline">
            {sections.length}/{SECTIONS.length} blocks
          </span>
        </div>
        <nav aria-label="Jump to category" className="-mx-1 overflow-x-auto [scrollbar-width:none]">
          <div className="flex w-max gap-0.5 px-1">
            {visibleCategories.map((c) => (
              <Button
                key={c}
                size="xs"
                variant={activeCategory === c ? "secondary" : "ghost"}
                className="text-muted-foreground data-[active=true]:text-foreground font-normal"
                data-active={activeCategory === c}
                onClick={() => jumpToCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </nav>
      </div>
      <div ref={scrollRef} className="bg-muted/30 relative min-h-0 flex-1 overflow-auto" data-slot="preview-scroll">
        {sections.length === 0 ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyTitle>No component matches “{query}”</EmptyTitle>
              <EmptyDescription>Try button, dialog, input, chart or sidebar.</EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" size="sm" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </Empty>
        ) : (
          <div className={cn("grid min-h-full", previewMode === "split" && "grid-cols-2 divide-x")}>
            {(previewMode === "split" ? (["light", "dark"] as const) : [previewMode]).map((mode, i) => (
              <PreviewRoot key={`pane-${i}`} theme={theme} mode={mode} className="min-w-0">
                {previewMode === "split" && (
                  <div className="text-muted-foreground bg-background sticky top-0 z-10 border-b px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase">
                    {mode === "light" ? ":root" : ".dark"} preview
                  </div>
                )}
                <Gallery sections={sections} query={deferredQuery} anchorPrefix={i === 0 ? ANCHOR : undefined} />
              </PreviewRoot>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
