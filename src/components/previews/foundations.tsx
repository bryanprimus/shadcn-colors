import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const SURFACES = [
  { name: "background", className: "bg-background text-foreground" },
  { name: "card", className: "bg-card text-card-foreground" },
  { name: "popover", className: "bg-popover text-popover-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "destructive", className: "bg-destructive/10 text-destructive border-destructive/30" },
  { name: "sidebar", className: "bg-sidebar text-sidebar-foreground" },
] as const

export function SurfacesPreview() {
  return (
    <div className="grid gap-4 @4xl:grid-cols-[1fr_auto]">
      <div className="grid content-start grid-cols-3 gap-2 @xl:grid-cols-5">
        {SURFACES.map((s) => (
          <div key={s.name} className={`flex h-20 flex-col justify-between rounded-lg border p-2.5 ${s.className}`}>
            <span className="text-xs font-medium">{s.name}</span>
            <span className="font-mono text-[10px] opacity-80">Aa 123</span>
          </div>
        ))}
        <div className="flex h-20 flex-col justify-between rounded-lg border-2 border-input p-2.5">
          <span className="text-xs font-medium">input</span>
          <span className="text-muted-foreground font-mono text-[10px]">border</span>
        </div>
      </div>
      <div className="flex min-w-56 flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground">
        <span className="text-muted-foreground text-xs font-medium">Content hierarchy</span>
        <p className="text-sm font-semibold">Foreground heading</p>
        <p className="text-sm">Body copy on card</p>
        <p className="text-muted-foreground text-sm">Muted supporting text</p>
        <a href="#" className="text-primary text-sm font-medium underline-offset-4 hover:underline" onClick={(e) => e.preventDefault()}>
          Primary link
        </a>
        <p className="text-destructive text-sm">Destructive message</p>
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="h-4 flex-1 rounded-sm" style={{ background: `var(--chart-${i})` }} />
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="ring-ring/50 inline-flex h-7 items-center rounded-md border border-ring px-2 text-xs ring-3">Focus ring</span>
        </div>
      </div>
    </div>
  )
}

export function TypographyPreview() {
  return (
    <article className="grid gap-8 @2xl:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        <Badge variant="secondary" className="w-fit">Changelog</Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance">Ship themes that hold up in the dark.</h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          A lead paragraph sets context before the details. It uses muted foreground to sit one step below the heading.
        </p>
        <h2 className="font-heading border-b pb-2 text-2xl font-semibold tracking-tight">Perceptual lightness first</h2>
        <p className="leading-7">
          Surfaces are separated by <strong>lightness</strong>, not saturation. The brand hue is injected at very low chroma, so
          the interface feels related to the brand without looking tinted. Inline code such as{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">--primary</code> stays legible.
        </p>
        <blockquote className="border-primary border-l-2 pl-6 italic">
          “Dark mode is a separate design, not an inverted one.”
        </blockquote>
        <h3 className="font-heading text-xl font-semibold tracking-tight">What the engine checks</h3>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>Foreground contrast on every surface</li>
          <li>Primary foreground chosen from measured contrast</li>
          <li>Gamut mapping at constant lightness and hue</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground">
        <h4 className="font-heading text-lg font-semibold">Type scale</h4>
        <Separator />
        {[
          ["text-4xl", "Display"],
          ["text-2xl", "Heading"],
          ["text-lg", "Title"],
          ["text-base", "Body"],
          ["text-sm", "Small"],
          ["text-xs", "Caption"],
        ].map(([size, label]) => (
          <div key={size} className="flex items-baseline justify-between gap-4">
            <span className={`${size} font-medium tracking-tight`}>{label}</span>
            <span className="text-muted-foreground font-mono text-xs">{size}</span>
          </div>
        ))}
        <Separator />
        <p className="text-muted-foreground text-sm">Muted text for metadata, timestamps and helper copy.</p>
        <p className="text-sm">
          <a href="#" className="text-primary font-medium underline underline-offset-4" onClick={(e) => e.preventDefault()}>
            Primary link
          </a>{" "}
          inside running text.
        </p>
      </div>
    </article>
  )
}
