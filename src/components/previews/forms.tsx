import * as React from "react"
import { format } from "date-fns"
import { AtSignIcon, CalendarIcon, CreditCardIcon, InfoIcon, LockIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const TIMEZONES = [
  { label: "Select a timezone", value: null },
  { label: "Pacific Time (UTC−08:00)", value: "pst" },
  { label: "Eastern Time (UTC−05:00)", value: "est" },
  { label: "Central European (UTC+01:00)", value: "cet" },
  { label: "Western Indonesia (UTC+07:00)", value: "wib" },
  { label: "Japan Standard (UTC+09:00)", value: "jst" },
]

const COUNTRIES = ["Australia", "Brazil", "Canada", "Germany", "Indonesia", "Japan", "Kenya", "Mexico", "Norway", "Singapore", "United Kingdom", "United States"]

export function AccountSettingsPreview() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account settings</CardTitle>
        <CardDescription>Inputs in every state, with Field, Select and Native Select.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 @2xl:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>Display name</FieldLabel>
              <Input id={`${id}-name`} defaultValue="Ada Lovelace" />
              <FieldDescription>Filled input.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-handle`}>Handle</FieldLabel>
              <Input id={`${id}-handle`} placeholder="@username" />
              <FieldDescription>Placeholder state.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
              <Input id={`${id}-email`} defaultValue="ada@analytical" aria-invalid />
              <FieldError>Enter a valid email address.</FieldError>
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor={`${id}-org`}>Organization</FieldLabel>
              <Input id={`${id}-org`} defaultValue="Analytical Engines Ltd" disabled />
              <FieldDescription>Managed by your administrator.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Timezone</FieldLabel>
              <Select items={TIMEZONES} defaultValue="cet">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Timezones</SelectLabel>
                    {TIMEZONES.filter((t) => t.value).map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-lang`}>Language</FieldLabel>
              <NativeSelect id={`${id}-lang`} defaultValue="en" className="w-full">
                <NativeSelectOption value="en">English</NativeSelectOption>
                <NativeSelectOption value="id">Bahasa Indonesia</NativeSelectOption>
                <NativeSelectOption value="de">Deutsch</NativeSelectOption>
                <NativeSelectOption value="ja">日本語</NativeSelectOption>
              </NativeSelect>
              <FieldDescription>Native select.</FieldDescription>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={`${id}-bio`}>Bio</FieldLabel>
            <Textarea id={`${id}-bio`} placeholder="Tell us a little about yourself" className="min-h-20" />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`${id}-public`}>Public profile</FieldLabel>
              <FieldDescription>Anyone with the link can see your profile.</FieldDescription>
            </FieldContent>
            <Switch id={`${id}-public`} defaultChecked />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  )
}

export function PaymentPreview() {
  const id = React.useId()
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 24))
  const [otp, setOtp] = React.useState("4821")
  return (
    <div className="grid gap-4 @4xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>Input Group, Combobox, Radio Group, Date Picker.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Plan</FieldLegend>
              <RadioGroup defaultValue="pro" className="grid gap-2 @xl:grid-cols-3">
                {[
                  { value: "starter", title: "Starter", price: "$0" },
                  { value: "pro", title: "Pro", price: "$24" },
                  { value: "team", title: "Team", price: "$79" },
                ].map((plan) => (
                  <FieldLabel key={plan.value} htmlFor={`${id}-${plan.value}`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>{plan.title}</FieldTitle>
                        <FieldDescription>{plan.price} / month</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={plan.value} id={`${id}-${plan.value}`} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor={`${id}-card`}>Card number</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <CreditCardIcon />
                </InputGroupAddon>
                <InputGroupInput id={`${id}-card`} placeholder="1234 5678 9012 3456" defaultValue="4242 4242 4242 4242" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>VISA</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field>
                <FieldLabel>Billing country</FieldLabel>
                <Combobox items={COUNTRIES} defaultValue="Indonesia">
                  <ComboboxInput placeholder="Search countries" />
                  <ComboboxContent>
                    <ComboboxEmpty>No country found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-date`}>First charge</FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={<Button variant="outline" id={`${id}-date`} className="justify-start px-2.5 font-normal" />}
                  >
                    <CalendarIcon data-icon="inline-start" />
                    {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`${id}-amount`}>Spending limit</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput id={`${id}-amount`} defaultValue="2,500.00" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-billing-email`}>Receipts to</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <AtSignIcon />
                  </InputGroupAddon>
                  <InputGroupInput id={`${id}-billing-email`} placeholder="billing@company.com" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" aria-label="Info">
                      <InfoIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
            <Field orientation="horizontal">
              <Checkbox id={`${id}-terms`} defaultChecked />
              <FieldLabel htmlFor={`${id}-terms`} className="font-normal">
                I agree to the terms and the automatic renewal policy.
              </FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 border-t">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <LockIcon className="size-3.5" /> Encrypted end to end
          </span>
          <Button>Pay $24.00</Button>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Verify it’s you</CardTitle>
            <CardDescription>Enter the 6 digit code from your authenticator.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-muted-foreground text-xs">
              Didn’t get a code?{" "}
              <a href="#" className="text-primary underline underline-offset-4" onClick={(e) => e.preventDefault()}>
                Resend
              </a>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
            <CardDescription>Input Group with textarea and actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search conversations" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>12 results</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <InputGroupTextarea placeholder="Ask a question about your invoice…" />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-xs">Markdown supported</InputGroupText>
                <InputGroupButton variant="default" size="sm" className="ml-auto">
                  Send
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center gap-2">
              <Label htmlFor={`${id}-copy`} className="text-muted-foreground text-xs">
                Also email me a copy
              </Label>
              <Switch id={`${id}-copy`} size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
