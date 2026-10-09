import {
  BarChart3Icon,
  BoxIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  LifeBuoyIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

const prevent = (e: React.MouseEvent) => e.preventDefault()

const NAV = [
  { title: "Home", icon: HomeIcon, active: true },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Analytics", icon: BarChart3Icon },
  { title: "Customers", icon: UsersIcon },
]

/**
 * The shadcn Sidebar is designed for full page layouts (fixed, h-svh). Here it
 * is contained: the provider gets a fixed height and the sidebar container is
 * positioned absolutely inside it, so it behaves like a real app shell within
 * the preview canvas.
 */
export function SidebarPreview() {
  return (
    <SidebarProvider
      className="relative h-[560px] min-h-0 overflow-hidden rounded-xl border"
      style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
    >
      <Sidebar collapsible="icon" className="absolute h-full">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <BoxIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc.</span>
                    <span className="text-muted-foreground truncate text-xs">Enterprise</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Teams</DropdownMenuLabel>
                    <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
                    <DropdownMenuItem>Acme Labs</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusIcon />
                    Add team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <form onSubmit={(e) => e.preventDefault()} className="relative group-data-[collapsible=icon]:hidden">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <SidebarInput placeholder="Search…" className="pl-8" />
          </form>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title} render={<a href="#" onClick={prevent} />}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
                <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
                  <CollapsibleTrigger render={<SidebarMenuButton tooltip="Settings" />}>
                    <SettingsIcon />
                    <span>Settings</span>
                    <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {["General", "Team", "Billing"].map((s, i) => (
                        <SidebarMenuSubItem key={s}>
                          <SidebarMenuSubButton isActive={i === 2} render={<a href="#" onClick={prevent} />}>
                            <span>{s}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="Add project">
              <PlusIcon />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {["Design system", "Marketing site", "Mobile app"].map((p) => (
                  <SidebarMenuItem key={p}>
                    <SidebarMenuButton render={<a href="#" onClick={prevent} />}>
                      <FolderIcon />
                      <span>{p}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontalIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support">
                <LifeBuoyIcon />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">AL</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Ada Lovelace</span>
                  <span className="text-muted-foreground truncate text-xs">ada@acme.dev</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-auto">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={prevent}>Acme</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge variant="secondary" className="ml-auto">Live</Badge>
        </header>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="grid gap-3 @xl:grid-cols-3">
            {[
              ["MRR", "$18.2k"],
              ["Active users", "4,281"],
              ["Open tickets", "17"],
            ].map(([k, v]) => (
              <Card key={k} size="sm">
                <CardHeader>
                  <CardDescription>{k}</CardDescription>
                  <CardTitle className="text-xl tabular-nums">{v}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Collapse the sidebar with the trigger, or press ⌘B.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
