import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  RocketIcon,
  TerminalIcon,
} from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { usePreview } from "@/components/preview/preview-context"

export function NotificationsPreview() {
  const { toast } = usePreview()
  return (
    <div className="grid gap-4 @4xl:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-3">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Deployment succeeded</AlertTitle>
          <AlertDescription>Production is now serving build 4f2c91a.</AlertDescription>
        </Alert>
        <Alert>
          <TerminalIcon />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
          <AlertAction>
            <Button size="xs" variant="outline">Docs</Button>
          </AlertAction>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            <p>Your card was declined. Please verify:</p>
            <ul className="list-inside list-disc text-sm">
              <li>Card details and billing address</li>
              <li>Sufficient funds</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Toasts</CardTitle>
          <CardDescription>shadcn Toast (Base UI). Rendered inside this preview’s portal.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => toast.add({ title: "Event created", description: "Friday, October 9 at 5:57 PM" })}
            >
              Default
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.add({ title: "Saved", description: "Your changes are live.", type: "success" })}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.add({ title: "Couldn’t connect", description: "Retrying in 5 seconds.", type: "error" })}
            >
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const id = toast.add({
                  title: "Message archived",
                  description: "You can undo this action.",
                  actionProps: {
                    children: "Undo",
                    onClick() {
                      toast.close(id)
                      toast.add({ description: "Message restored." })
                    },
                  },
                })
              }}
            >
              With action
            </Button>
          </div>
          <ItemGroup className="gap-2">
            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <RocketIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>New release</ItemTitle>
                <ItemDescription>v2.4 adds theme sharing.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge>New</Badge>
              </ItemActions>
            </Item>
            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Scheduled maintenance</ItemTitle>
                <ItemDescription>Sunday 02:00 to 03:00 UTC.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadingPreview() {
  return (
    <div className="grid gap-4 @2xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Skeleton</CardTitle>
          <CardDescription>Placeholder while content loads.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-28 w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spinner</CardTitle>
          <CardDescription>Inline and in controls.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="text-primary size-8" />
            <Spinner className="text-muted-foreground size-6" />
          </div>
          <Button disabled className="w-fit">
            <Spinner data-icon="inline-start" />
            Processing payment
          </Button>
          <Badge variant="secondary" className="w-fit">
            <Spinner />
            Syncing
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Determinate loading.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Progress value={33}>
            <ProgressLabel>Uploading assets</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={86}>
            <ProgressLabel>Building</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={100}>
            <ProgressLabel>Checks</ProgressLabel>
            <ProgressValue />
          </Progress>
        </CardContent>
      </Card>
    </div>
  )
}
