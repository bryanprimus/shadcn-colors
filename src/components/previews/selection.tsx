import * as React from "react"
import { BellIcon, MailIcon, SmartphoneIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function PreferencesPreview() {
  const id = React.useId()
  const [volume, setVolume] = React.useState(64)
  const [range, setRange] = React.useState<number[]>([20, 80])
  return (
    <div className="grid gap-4 @4xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Checkbox and Switch, on and off.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4">
            <FieldSet>
              <FieldLegend variant="label">Email me about</FieldLegend>
              <Field orientation="horizontal">
                <Checkbox id={`${id}-c1`} defaultChecked />
                <FieldLabel htmlFor={`${id}-c1`} className="font-normal">Mentions</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${id}-c2`} />
                <FieldLabel htmlFor={`${id}-c2`} className="font-normal">Weekly digest</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${id}-c3`} indeterminate />
                <FieldLabel htmlFor={`${id}-c3`} className="font-normal">Some projects</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled>
                <Checkbox id={`${id}-c4`} disabled defaultChecked />
                <FieldLabel htmlFor={`${id}-c4`} className="font-normal">Security alerts (required)</FieldLabel>
              </Field>
            </FieldSet>
            {[
              { icon: BellIcon, label: "Push", on: true },
              { icon: MailIcon, label: "Email", on: false },
              { icon: SmartphoneIcon, label: "SMS", on: false, disabled: true },
            ].map(({ icon: Icon, label, on, disabled }) => (
              <Field key={label} orientation="horizontal" data-disabled={disabled || undefined}>
                <Icon className="text-muted-foreground size-4" />
                <FieldLabel htmlFor={`${id}-${label}`} className="font-normal">{label}</FieldLabel>
                <Switch id={`${id}-${label}`} defaultChecked={on} disabled={disabled} className="ml-auto" />
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Radio Group and Toggle Group.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <RadioGroup defaultValue="comfortable">
            {[
              { value: "default", label: "Default", hint: "Balanced spacing" },
              { value: "comfortable", label: "Comfortable", hint: "More breathing room" },
              { value: "compact", label: "Compact", hint: "Dense tables and lists" },
            ].map((o) => (
              <Field key={o.value} orientation="horizontal">
                <RadioGroupItem value={o.value} id={`${id}-${o.value}`} />
                <FieldContent>
                  <FieldLabel htmlFor={`${id}-${o.value}`}>{o.label}</FieldLabel>
                  <FieldDescription>{o.hint}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
            <Field orientation="horizontal" data-disabled>
              <RadioGroupItem value="legacy" id={`${id}-legacy`} disabled />
              <FieldLabel htmlFor={`${id}-legacy`}>Legacy (disabled)</FieldLabel>
            </Field>
          </RadioGroup>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Theme</Label>
            <ToggleGroup variant="outline" defaultValue={["system"]} className="w-full">
              <ToggleGroupItem value="light" className="flex-1">Light</ToggleGroupItem>
              <ToggleGroupItem value="dark" className="flex-1">Dark</ToggleGroupItem>
              <ToggleGroupItem value="system" className="flex-1">System</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Weekdays (multiple)</Label>
            <ToggleGroup multiple defaultValue={["mon", "wed", "fri"]} spacing={1}>
              {["mon", "tue", "wed", "thu", "fri"].map((d) => (
                <ToggleGroupItem key={d} value={d} className="capitalize">
                  {d}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
          <CardDescription>Slider with live values.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <Label>Volume</Label>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">{volume}%</span>
            </div>
            <Slider value={[volume]} onValueChange={(v) => setVolume(Array.isArray(v) ? v[0] : v)} max={100} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <Label>Frequency band</Label>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {range[0]}–{range[1]} Hz
              </span>
            </div>
            <Slider value={range} onValueChange={(v) => setRange(Array.isArray(v) ? [...v] : [v])} max={100} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <Label className="text-muted-foreground">Balance (disabled)</Label>
              <span className="text-muted-foreground font-mono text-xs">50</span>
            </div>
            <Slider defaultValue={[50]} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
