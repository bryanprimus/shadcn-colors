import * as React from "react"
import { BellIcon, InfoIcon, SettingsIcon, SlidersHorizontalIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

function OverlayTile({ name, hint, children }: { name: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{hint}</span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function SettingsDialog() {
  const id = React.useId()
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        <SettingsIcon data-icon="inline-start" />
        Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Workspace settings</DialogTitle>
          <DialogDescription>Changes apply to everyone in Acme.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="pt-3">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-ws`}>Workspace name</FieldLabel>
                <Input id={`${id}-ws`} defaultValue="Acme Inc." />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-url`}>URL</FieldLabel>
                <Input id={`${id}-url`} defaultValue="acme.dev/team" />
              </Field>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="notifications" className="pt-3">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={`${id}-digest`}>Daily digest</FieldLabel>
                <FieldDescription>Summary of activity at 9:00.</FieldDescription>
              </FieldContent>
              <Switch id={`${id}-digest`} defaultChecked />
            </Field>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function OverlaysPreview() {
  const [radius, setRadius] = React.useState(12)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overlays</CardTitle>
        <CardDescription>
          Every trigger opens real, interactive content rendered through a portal that stays inside this themed preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 @xl:grid-cols-2 @6xl:grid-cols-3">
        <OverlayTile name="Dialog" hint="Settings dialog with tabs and fields.">
          <SettingsDialog />
        </OverlayTile>
        <OverlayTile name="Alert Dialog" hint="Destructive confirmation.">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              <Trash2Icon data-icon="inline-start" />
              Delete project
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete “marketing-site”?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the project, its deployments and 14 environment variables.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </OverlayTile>
        <OverlayTile name="Sheet" hint="Side panel for filters.">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              <SlidersHorizontalIcon data-icon="inline-start" />
              Filters
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down the activity feed.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-4">
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="sheet-deploys" className="font-normal">Deployments</FieldLabel>
                  <Switch id="sheet-deploys" defaultChecked className="ml-auto" />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="sheet-comments" className="font-normal">Comments</FieldLabel>
                  <Switch id="sheet-comments" className="ml-auto" />
                </Field>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span>Corner radius</span>
                    <span className="text-muted-foreground font-mono text-xs">{radius}px</span>
                  </div>
                  <Slider value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} max={24} />
                </div>
              </div>
              <SheetFooter>
                <SheetClose render={<Button />}>Apply filters</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </OverlayTile>
        <OverlayTile name="Drawer" hint="Bottom drawer with swipe to close.">
          <Drawer>
            <DrawerTrigger render={<Button variant="secondary" />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Move goal</DrawerTitle>
                  <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div className="flex items-center justify-center gap-6 p-4">
                  <span className="text-6xl font-bold tracking-tighter tabular-nums">350</span>
                  <span className="text-muted-foreground text-xs uppercase">kcal / day</span>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </OverlayTile>
        <OverlayTile name="Popover" hint="Inline form in a popover.">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              <BellIcon data-icon="inline-start" />
              Reminders
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <PopoverHeader>
                <PopoverTitle>Remind me</PopoverTitle>
                <PopoverDescription>We’ll nudge you before the deadline.</PopoverDescription>
              </PopoverHeader>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="pop-before" className="w-24">Before</FieldLabel>
                  <Input id="pop-before" defaultValue="2 hours" className="h-8" />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="pop-channel" className="w-24">Channel</FieldLabel>
                  <Input id="pop-channel" defaultValue="Email" className="h-8" />
                </Field>
              </FieldGroup>
            </PopoverContent>
          </Popover>
        </OverlayTile>
        <OverlayTile name="Tooltip and Hover Card" hint="Hover or focus the triggers.">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Info" />}>
              <InfoIcon />
            </TooltipTrigger>
            <TooltipContent>
              Keyboard shortcut <Kbd>?</Kbd>
            </TooltipContent>
          </Tooltip>
          <HoverCard>
            <HoverCardTrigger delay={150} render={<Button variant="link" />}>@shadcn</HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">@shadcn</p>
                <p className="text-sm">Beautifully designed components you can copy and paste into your apps.</p>
                <p className="text-muted-foreground text-xs">Joined December 2021</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </OverlayTile>
      </CardContent>
    </Card>
  )
}
