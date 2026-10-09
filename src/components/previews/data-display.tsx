import * as React from "react"
import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  DollarSignIcon,
  FolderOpenIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  ActivityIcon,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { DateRange } from "react-day-picker"

const STATS = [
  { title: "Total revenue", value: "$45,231.89", delta: "+20.1%", up: true, icon: DollarSignIcon },
  { title: "Subscriptions", value: "+2,350", delta: "+180.1%", up: true, icon: UsersIcon },
  { title: "Churn", value: "2.4%", delta: "−0.3%", up: false, icon: CreditCardIcon },
  { title: "Active now", value: "573", delta: "+201", up: true, icon: ActivityIcon },
]

export function AnalyticsPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 @xl:grid-cols-2 @6xl:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.title} size="sm">
            <CardHeader>
              <CardDescription>{s.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{s.value}</CardTitle>
              <CardAction>
                <Badge variant={s.up ? "secondary" : "outline"}>
                  {s.up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {s.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-muted-foreground gap-1.5 text-xs">
              <s.icon className="size-3.5" /> vs. last month
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 @4xl:grid-cols-3">
        <Card className="@4xl:col-span-2">
          <CardHeader>
            <CardTitle>Usage this cycle</CardTitle>
            <CardDescription>Progress with labels and values.</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">
                Upgrade
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {[
              { label: "API requests", value: 72 },
              { label: "Storage", value: 38 },
              { label: "Seats", value: 94 },
            ].map((p) => (
              <Progress key={p.label} value={p.value}>
                <ProgressLabel>{p.label}</ProgressLabel>
                <ProgressValue />
              </Progress>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Pro plan</CardTitle>
            <CardDescription>Billed annually, renews Nov 1.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">$24</span>
              <span className="text-muted-foreground text-sm">/ seat / month</span>
            </div>
            <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
              {["Unlimited projects", "Priority support", "Audit log"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <BadgeCheckIcon className="text-primary size-4" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Manage billing</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export function ItemsPreview() {
  return (
    <div className="grid gap-4 @4xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Item, Avatar, Badge and Hover Card.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <AvatarGroup>
              {["AL", "GH", "KJ", "MH"].map((i) => (
                <Avatar key={i}>
                  <AvatarFallback>{i}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+8</AvatarGroupCount>
            </AvatarGroup>
            <div className="flex flex-wrap gap-1.5">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
          </div>
          <ItemGroup className="rounded-lg border">
            {[
              { name: "Grace Hopper", role: "Owner", initials: "GH", online: true },
              { name: "Katherine Johnson", role: "Admin", initials: "KJ", online: false },
              { name: "Margaret Hamilton", role: "Member", initials: "MH", online: true },
            ].map((m, i) => (
              <React.Fragment key={m.name}>
                {i > 0 && <ItemSeparator />}
                <Item size="sm">
                  <ItemMedia>
                    <Avatar>
                      <AvatarFallback>{m.initials}</AvatarFallback>
                      {m.online && <AvatarBadge />}
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      <HoverCard>
                        <HoverCardTrigger delay={200} render={<a href="#" onClick={(e) => e.preventDefault()} className="hover:underline" />}>
                          {m.name}
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarFallback>{m.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold">{m.name}</p>
                              <p className="text-muted-foreground text-xs">{m.role} · joined March 2024</p>
                              <p className="text-sm">Ships most of the design system.</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </ItemTitle>
                    <ItemDescription>{m.role}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant={m.role === "Owner" ? "default" : "outline"}>{m.role}</Badge>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <ShieldCheckIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Two factor authentication</ItemTitle>
              <ItemDescription>Required for all admins since June.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">Review</Button>
            </ItemActions>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Muted item</ItemTitle>
              <ItemDescription>Uses the muted surface token.</ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>Create your first project to start tracking deployments.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>
                <PlusIcon data-icon="inline-start" />
                New project
              </Button>
              <Button variant="outline">Import</Button>
            </div>
          </EmptyContent>
        </Empty>
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Accordion and Collapsible.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Accordion defaultValue={["item-1"]}>
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I change plans later?</AccordionTrigger>
                <AccordionContent>Yes. Changes are prorated to the day and apply immediately.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                <AccordionContent>Within 30 days of purchase, no questions asked.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there an API?</AccordionTrigger>
                <AccordionContent>A REST and a GraphQL API, both with typed SDKs.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Collapsible className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">3 starred repositories</span>
                <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle" />}>
                  <ChevronsUpDownIcon />
                </CollapsibleTrigger>
              </div>
              <div className="rounded-md border px-3 py-2 font-mono text-xs">shadcn/ui</div>
              <CollapsibleContent className="flex flex-col gap-2">
                <div className="rounded-md border px-3 py-2 font-mono text-xs">mui/base-ui</div>
                <div className="rounded-md border px-3 py-2 font-mono text-xs">evilmartians/oklch-picker</div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function CalendarPreview() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 9))
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 19),
  })
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9)} className="rounded-lg border" />
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={new Date(2026, 9)}
        numberOfMonths={2}
        className="rounded-lg border"
      />
    </div>
  )
}

const SLIDES = [
  { title: "Launch week", body: "Five days of releases.", tone: "bg-primary text-primary-foreground" },
  { title: "Templates", body: "Start from a polished base.", tone: "bg-secondary text-secondary-foreground" },
  { title: "Analytics", body: "Understand what users do.", tone: "bg-accent text-accent-foreground" },
  { title: "Security", body: "SSO, SCIM and audit logs.", tone: "bg-muted text-foreground" },
  { title: "Support", body: "Humans, around the clock.", tone: "bg-card text-card-foreground" },
]

export function CarouselPreview() {
  return (
    <div className="px-12">
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {SLIDES.map((s) => (
            <CarouselItem key={s.title} className="@xl:basis-1/2 @6xl:basis-1/3">
              <div className={`flex aspect-[4/3] flex-col justify-end gap-1 rounded-xl border p-5 ${s.tone}`}>
                <span className="text-lg font-semibold">{s.title}</span>
                <span className="text-sm opacity-80">{s.body}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
