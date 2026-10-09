import type * as React from "react"

import { ButtonsPreview } from "@/components/previews/actions"
import { ChartsPreview } from "@/components/previews/charts"
import { CalendarPreview, CarouselPreview, AnalyticsPreview, ItemsPreview } from "@/components/previews/data-display"
import { TeamTablePreview } from "@/components/previews/data-table"
import { LoadingPreview, NotificationsPreview } from "@/components/previews/feedback"
import { AccountSettingsPreview, PaymentPreview } from "@/components/previews/forms"
import { SurfacesPreview, TypographyPreview } from "@/components/previews/foundations"
import { LayoutPreview } from "@/components/previews/layout"
import { MenusPreview } from "@/components/previews/menus"
import { NavigationPreview } from "@/components/previews/navigation"
import { OverlaysPreview } from "@/components/previews/overlays"
import { PreferencesPreview } from "@/components/previews/selection"
import { SidebarPreview } from "@/components/previews/sidebar"

export const CATEGORIES = [
  "Foundations",
  "Buttons and actions",
  "Form controls",
  "Selection",
  "Navigation",
  "Data display",
  "Feedback",
  "Overlays",
  "Menus",
  "Layout",
  "Charts",
  "Sidebar",
  "Loading states",
] as const

export type Category = (typeof CATEGORIES)[number]

export interface GallerySection {
  id: string
  category: Category
  title: string
  description: string
  /** shadcn components demonstrated, used for search and tags. */
  components: string[]
  Component: React.ComponentType
}

export const SECTIONS: GallerySection[] = [
  {
    id: "surfaces",
    category: "Foundations",
    title: "Surfaces and content",
    description: "Every semantic surface with its paired foreground, chart colors and the focus ring.",
    components: ["Tokens", "Colors", "Ring"],
    Component: SurfacesPreview,
  },
  {
    id: "typography",
    category: "Foundations",
    title: "Typography",
    description: "Headings, lead, body, blockquote, lists and inline code.",
    components: ["Typography", "Separator", "Badge"],
    Component: TypographyPreview,
  },
  {
    id: "buttons",
    category: "Buttons and actions",
    title: "Buttons and actions",
    description: "Variants, sizes, icon buttons, loading and disabled states.",
    components: ["Button", "Button Group", "Toggle", "Toggle Group", "Kbd", "Spinner", "Tooltip"],
    Component: ButtonsPreview,
  },
  {
    id: "account",
    category: "Form controls",
    title: "Account settings form",
    description: "Inputs in normal, placeholder, filled, disabled and invalid states.",
    components: ["Input", "Field", "Label", "Select", "Native Select", "Textarea", "Switch", "Card"],
    Component: AccountSettingsPreview,
  },
  {
    id: "payment",
    category: "Form controls",
    title: "Payment form",
    description: "Input groups, combobox, date picker and one time passcode.",
    components: ["Input Group", "Combobox", "Date Picker", "Popover", "Calendar", "Input OTP", "Radio Group", "Checkbox", "Field"],
    Component: PaymentPreview,
  },
  {
    id: "preferences",
    category: "Selection",
    title: "Preferences",
    description: "Checkbox, Switch, Radio Group, Toggle Group and Slider in selected and unselected states.",
    components: ["Checkbox", "Switch", "Radio Group", "Toggle Group", "Slider", "Label"],
    Component: PreferencesPreview,
  },
  {
    id: "navigation",
    category: "Navigation",
    title: "Navigation",
    description: "Navigation Menu, Menubar, Breadcrumb, Tabs and Pagination.",
    components: ["Navigation Menu", "Menubar", "Breadcrumb", "Tabs", "Pagination"],
    Component: NavigationPreview,
  },
  {
    id: "analytics",
    category: "Data display",
    title: "Analytics cards",
    description: "Stat cards, badges, progress and a billing plan.",
    components: ["Card", "Badge", "Progress", "Button"],
    Component: AnalyticsPreview,
  },
  {
    id: "team-table",
    category: "Data display",
    title: "Team management table",
    description: "Sortable, filterable, selectable data table with row actions.",
    components: ["Data Table", "Table", "Checkbox", "Dropdown Menu", "Avatar", "Badge", "Input Group"],
    Component: TeamTablePreview,
  },
  {
    id: "items",
    category: "Data display",
    title: "People and content",
    description: "Item, Avatar group, Hover Card, Empty state, Accordion and Collapsible.",
    components: ["Item", "Avatar", "Badge", "Hover Card", "Empty", "Accordion", "Collapsible", "Separator"],
    Component: ItemsPreview,
  },
  {
    id: "calendar",
    category: "Data display",
    title: "Calendar",
    description: "Single date and two month range selection.",
    components: ["Calendar", "Date Picker"],
    Component: CalendarPreview,
  },
  {
    id: "carousel",
    category: "Data display",
    title: "Carousel",
    description: "Embla carousel with previous and next controls.",
    components: ["Carousel"],
    Component: CarouselPreview,
  },
  {
    id: "notifications",
    category: "Feedback",
    title: "Notifications",
    description: "Alerts (default and destructive) and interactive toasts.",
    components: ["Alert", "Toast", "Item", "Badge"],
    Component: NotificationsPreview,
  },
  {
    id: "overlays",
    category: "Overlays",
    title: "Overlays",
    description: "Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip and Hover Card.",
    components: ["Dialog", "Alert Dialog", "Sheet", "Drawer", "Popover", "Tooltip", "Hover Card", "Tabs"],
    Component: OverlaysPreview,
  },
  {
    id: "menus",
    category: "Menus",
    title: "Command palette and menus",
    description: "Command, Command Dialog, Dropdown Menu and Context Menu.",
    components: ["Command", "Command Dialog", "Dropdown Menu", "Context Menu", "Kbd"],
    Component: MenusPreview,
  },
  {
    id: "layout",
    category: "Layout",
    title: "Layout primitives",
    description: "Resizable panels, Scroll Area, Aspect Ratio and Separator.",
    components: ["Resizable", "Scroll Area", "Aspect Ratio", "Separator"],
    Component: LayoutPreview,
  },
  {
    id: "charts",
    category: "Charts",
    title: "Charts",
    description: "Area, bar, line and donut charts using all five chart tokens.",
    components: ["Chart", "Card"],
    Component: ChartsPreview,
  },
  {
    id: "sidebar",
    category: "Sidebar",
    title: "Sidebar dashboard",
    description: "Collapsible sidebar using every sidebar token.",
    components: ["Sidebar", "Collapsible", "Dropdown Menu", "Breadcrumb", "Skeleton", "Avatar"],
    Component: SidebarPreview,
  },
  {
    id: "loading",
    category: "Loading states",
    title: "Loading states",
    description: "Skeleton, Spinner and Progress.",
    components: ["Skeleton", "Spinner", "Progress"],
    Component: LoadingPreview,
  },
]

export function searchSections(query: string): GallerySection[] {
  const q = query.trim().toLowerCase()
  if (!q) return SECTIONS
  const terms = q.split(/\s+/)
  return SECTIONS.filter((s) => {
    const hay = [s.title, s.category, s.description, ...s.components].join(" ").toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}
