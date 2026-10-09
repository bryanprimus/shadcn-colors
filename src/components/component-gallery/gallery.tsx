import * as React from "react"

import { Badge } from "@/components/ui/badge"

import type { GallerySection } from "./sections"

/**
 * Renders gallery sections. Memoized: theme changes only update CSS variables
 * on the enclosing preview root, so the component tree itself does not rerender.
 */
export const Gallery = React.memo(function Gallery({
  sections,
  query,
  anchorPrefix,
}: {
  sections: GallerySection[]
  query: string
  /** Only one pane registers scroll anchors in split view. */
  anchorPrefix?: string
}) {
  const q = query.trim().toLowerCase()
  return (
    // Container queries let each pane lay out by its own width (split view).
    <div className="@container">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-6 @2xl:px-8 @2xl:py-8">
      {sections.map((s) => (
        <section
          key={s.id}
          id={anchorPrefix ? `${anchorPrefix}${s.id}` : undefined}
          data-section={s.id}
          className="flex scroll-mt-4 flex-col gap-4"
        >
          <header className="flex flex-col gap-2 border-b pb-3 @xl:flex-row @xl:items-end @xl:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">{s.category}</span>
              <h2 className="text-base font-semibold tracking-tight">{s.title}</h2>
              <p className="text-muted-foreground text-sm">{s.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 @xl:max-w-[45%] @xl:justify-end">
              {s.components.map((c) => (
                <Badge key={c} variant={q && c.toLowerCase().includes(q) ? "default" : "outline"} className="font-normal">
                  {c}
                </Badge>
              ))}
            </div>
          </header>
          <s.Component />
        </section>
      ))}
    </div>
    </div>
  )
})
