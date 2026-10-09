import {
  ArchiveIcon,
  ArrowRightIcon,
  BoldIcon,
  ChevronDownIcon,
  CopyIcon,
  ItalicIcon,
  PlusIcon,
  SendIcon,
  SettingsIcon,
  StarIcon,
  Trash2Icon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-2 @xl:grid-cols-[7rem_1fr]">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export function ButtonsPreview() {
  return (
    <div className="grid gap-4 @6xl:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Every variant, size and state.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Row label="Variants">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Disabled">
            <Button disabled>Default</Button>
            <Button variant="secondary" disabled>Secondary</Button>
            <Button variant="outline" disabled>Outline</Button>
          </Row>
          <Row label="Sizes">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="Icons">
            <Button>
              <SendIcon data-icon="inline-start" />
              Send
            </Button>
            <Button variant="outline">
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Tooltip>
              <TooltipTrigger render={<Button size="icon" aria-label="Add" />}>
                <PlusIcon />
              </TooltipTrigger>
              <TooltipContent>Add item</TooltipContent>
            </Tooltip>
            <Button size="icon" variant="secondary" aria-label="Settings">
              <SettingsIcon />
            </Button>
            <Button size="icon" variant="outline" aria-label="Copy">
              <CopyIcon />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Delete">
              <Trash2Icon />
            </Button>
          </Row>
          <Row label="Loading">
            <Button disabled>
              <Spinner data-icon="inline-start" />
              Saving
            </Button>
            <Button variant="outline" disabled>
              <Spinner data-icon="inline-start" />
              Please wait
            </Button>
          </Row>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Groups and toggles</CardTitle>
          <CardDescription>Button Group, Toggle, Toggle Group, Kbd.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="outline">
              <ArchiveIcon data-icon="inline-start" />
              Archive
            </Button>
            <Button variant="outline">Snooze</Button>
            <Button variant="outline" size="icon" aria-label="More">
              <ChevronDownIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Button variant="outline">acme.dev</Button>
            <ButtonGroupSeparator />
            <Button variant="secondary">Copy</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>Merge pull request</Button>
            <ButtonGroupSeparator />
            <Button size="icon" aria-label="Merge options">
              <ChevronDownIcon />
            </Button>
          </ButtonGroup>
          <div className="flex flex-wrap items-center gap-2">
            <Toggle aria-label="Bold" defaultPressed>
              <BoldIcon />
            </Toggle>
            <Toggle aria-label="Italic">
              <ItalicIcon />
            </Toggle>
            <Toggle variant="outline" aria-label="Star" defaultPressed>
              <StarIcon />
              Starred
            </Toggle>
            <Toggle variant="outline" disabled aria-label="Underline">
              <UnderlineIcon />
            </Toggle>
          </div>
          <ToggleGroup variant="outline" defaultValue={["left"]}>
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeftIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenterIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRightIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              Search <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
            </span>
            <span className="flex items-center gap-1.5">
              Save <KbdGroup><Kbd>Ctrl</Kbd><Kbd>S</Kbd></KbdGroup>
            </span>
            <span className="flex items-center gap-1.5">
              Close <Kbd>Esc</Kbd>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
