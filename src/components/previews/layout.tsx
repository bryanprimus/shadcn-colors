import * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const TAGS = Array.from({ length: 40 }, (_, i) => `v1.${40 - i}.0`)
const ARTWORKS = ["Ornella", "Tom Byrom", "Vladimir M.", "Lea Böhm", "Rui Silva", "Iga Ola"]

export function LayoutPreview() {
  return (
    <div className="grid gap-4 @4xl:grid-cols-2">
      <ResizablePanelGroup orientation="horizontal" className="min-h-64 rounded-lg border">
        <ResizablePanel defaultSize="35%" minSize="20%">
          <div className="flex h-full flex-col gap-1 p-3">
            <span className="text-muted-foreground text-xs font-medium">Inbox</span>
            {["Design review", "Q4 planning", "Invoice #1042", "Standup notes"].map((m, i) => (
              <div key={m} className={i === 0 ? "bg-accent text-accent-foreground rounded-md px-2 py-1.5 text-sm" : "rounded-md px-2 py-1.5 text-sm"}>
                {m}
              </div>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="65%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="60%">
              <div className="flex h-full flex-col gap-2 p-4">
                <span className="font-semibold">Design review</span>
                <span className="text-muted-foreground text-sm">Drag the handles to resize. Panels use border, muted and accent tokens.</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="40%">
              <div className="bg-muted/50 text-muted-foreground flex h-full items-center justify-center text-sm">Reply</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[10rem_1fr] gap-4">
          <ScrollArea className="h-64 rounded-md border">
            <div className="p-3">
              <h4 className="mb-3 text-sm leading-none font-medium">Tags</h4>
              {TAGS.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="font-mono text-xs">{tag}</div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
          <div className="flex min-w-0 flex-col gap-3">
            <AspectRatio ratio={16 / 9} className="bg-muted flex items-end overflow-hidden rounded-lg border p-3">
              <Badge variant="secondary">AspectRatio 16 / 9</Badge>
            </AspectRatio>
            <div className="flex h-5 items-center gap-3 text-sm">
              <span>Blog</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Source</span>
            </div>
          </div>
        </div>
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <div className="flex w-max gap-3 p-3">
            {ARTWORKS.map((a, i) => (
              <figure key={a} className="shrink-0">
                <div
                  className="h-20 w-32 rounded-md border"
                  style={{ background: `var(--chart-${(i % 5) + 1})` }}
                />
                <figcaption className="text-muted-foreground pt-1.5 text-xs">
                  Photo by <span className="text-foreground font-medium">{a}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
