import * as React from "react"
import {
  CalendarIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  ScissorsIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
  ClipboardIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { usePreview } from "@/components/preview/preview-context"

function PaletteItems({ onSelect }: { onSelect?: (label: string) => void }) {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem onSelect={() => onSelect?.("Calendar")}>
          <CalendarIcon />
          Calendar
        </CommandItem>
        <CommandItem onSelect={() => onSelect?.("Search emoji")}>
          <SmileIcon />
          Search emoji
        </CommandItem>
        <CommandItem disabled>
          <PaletteIcon />
          Theme editor (disabled)
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem onSelect={() => onSelect?.("Profile")}>
          <UserIcon />
          Profile
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={() => onSelect?.("Billing")}>
          <CreditCardIcon />
          Billing
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={() => onSelect?.("Settings")}>
          <SettingsIcon />
          Settings
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export function MenusPreview() {
  const { toast } = usePreview()
  const [open, setOpen] = React.useState(false)
  const [showStatus, setShowStatus] = React.useState(true)
  const [showPanel, setShowPanel] = React.useState(false)
  const [position, setPosition] = React.useState("bottom")

  const select = (label: string) => {
    setOpen(false)
    toast.add({ title: `Opened ${label}`, description: "Selected from the command palette." })
  }

  return (
    <div className="grid gap-4 @4xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Command palette</CardTitle>
          <CardDescription>Inline Command, plus the same palette in a Command Dialog.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Command className="rounded-lg border" data-scroll-contain>
            <CommandInput placeholder="Type a command or search…" />
            <CommandList className="max-h-56">
              <PaletteItems onSelect={select} />
            </CommandList>
          </Command>
          <Button variant="outline" className="text-muted-foreground w-full justify-between font-normal" onClick={() => setOpen(true)}>
            Search everything…
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <Command data-scroll-contain>
              <CommandInput placeholder="Type a command or search…" />
              <CommandList>
                <PaletteItems onSelect={select} />
              </CommandList>
            </Command>
          </CommandDialog>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dropdown and context menus</CardTitle>
          <CardDescription>Items, checkboxes, radios, submenus and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <UserIcon data-icon="inline-start" />
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>ada@acme.dev</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FileTextIcon />
                      Export
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>CSV</DropdownMenuItem>
                      <DropdownMenuItem>JSON</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="View options" />}>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
                    Status bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                    Panel
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Panel position</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ContextMenu>
            <ContextMenuTrigger className="text-muted-foreground flex h-36 items-center justify-center rounded-lg border border-dashed text-sm">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuGroup>
                <ContextMenuItem>
                  <ScissorsIcon />
                  Cut
                  <ContextMenuShortcut>⌘X</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <CopyIcon />
                  Copy
                  <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem disabled>
                  <ClipboardIcon />
                  Paste
                  <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Save page as…</ContextMenuItem>
                    <ContextMenuItem>Developer tools</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem defaultChecked>Show bookmarks</ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuLabel>People</ContextMenuLabel>
                <ContextMenuRadioGroup defaultValue="ada">
                  <ContextMenuRadioItem value="ada">Ada Lovelace</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="alan">Alan Turing</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </CardContent>
      </Card>
    </div>
  )
}
