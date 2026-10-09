import { BookOpenIcon, LayoutDashboardIcon, PuzzleIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const prevent = (e: React.MouseEvent) => e.preventDefault()

function ListItem({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <li>
      <NavigationMenuLink render={<a href="#" onClick={prevent} />}>
        <div className="flex gap-3">
          {Icon && <Icon className="text-primary mt-0.5 size-4 shrink-0" />}
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}

export function NavigationPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>App header</CardTitle>
          <CardDescription>Navigation Menu, Menubar and Breadcrumb.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1 p-1 md:grid-cols-2">
                    <ListItem title="Dashboard" icon={LayoutDashboardIcon}>
                      Realtime metrics for every workspace.
                    </ListItem>
                    <ListItem title="Integrations" icon={PuzzleIcon}>
                      Connect billing, auth and analytics.
                    </ListItem>
                    <ListItem title="Documentation" icon={BookOpenIcon}>
                      Guides, API reference and examples.
                    </ListItem>
                    <ListItem title="Changelog">What shipped this week.</ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[260px] gap-1 p-1">
                    <ListItem title="Blog">Stories from the team.</ListItem>
                    <ListItem title="Community">Ask questions, share themes.</ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<a href="#" onClick={prevent} />} className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Menubar className="w-fit">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>
                    New tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New window <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem disabled>New incognito window</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Share</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Email link</MenubarItem>
                    <MenubarItem>Messages</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem variant="destructive">Close workspace</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem defaultChecked>Show bookmarks</MenubarCheckboxItem>
                <MenubarCheckboxItem>Show full URLs</MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarRadioGroup defaultValue="comfortable">
                  <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                  <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Help</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Documentation</MenubarItem>
                <MenubarItem>Keyboard shortcuts</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={prevent}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={prevent}>Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
      <div className="grid gap-4 @4xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Default and line variants.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-muted-foreground text-sm">
                Revenue is up 12% compared to last month.
              </TabsContent>
              <TabsContent value="analytics" className="text-muted-foreground text-sm">
                3,214 sessions, 41% returning.
              </TabsContent>
              <TabsContent value="reports" className="text-muted-foreground text-sm">
                2 reports scheduled for Monday.
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="activity">
              <TabsList variant="line">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagination</CardTitle>
            <CardDescription>Active, ellipsis and navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={prevent} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={prevent}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={prevent} isActive>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={prevent}>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" onClick={prevent} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
