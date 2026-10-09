import * as React from "react"
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDownIcon, MoreHorizontalIcon, SearchIcon, UserPlusIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePreview } from "@/components/preview/preview-context"

interface Member {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member" | "Viewer"
  status: "Active" | "Invited" | "Suspended"
  seats: number
}

const MEMBERS: Member[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@acme.dev", role: "Owner", status: "Active", seats: 12 },
  { id: "2", name: "Alan Turing", email: "alan@acme.dev", role: "Admin", status: "Active", seats: 8 },
  { id: "3", name: "Grace Hopper", email: "grace@acme.dev", role: "Member", status: "Invited", seats: 3 },
  { id: "4", name: "Edsger Dijkstra", email: "edsger@acme.dev", role: "Member", status: "Active", seats: 5 },
  { id: "5", name: "Barbara Liskov", email: "barbara@acme.dev", role: "Viewer", status: "Suspended", seats: 1 },
  { id: "6", name: "Donald Knuth", email: "don@acme.dev", role: "Member", status: "Active", seats: 4 },
  { id: "7", name: "Frances Allen", email: "fran@acme.dev", role: "Admin", status: "Active", seats: 7 },
  { id: "8", name: "John Backus", email: "john@acme.dev", role: "Viewer", status: "Invited", seats: 2 },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")

function RowActions({ member }: { member: Member }) {
  const { toast } = usePreview()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`} />}>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => toast.add({ title: "Email copied", description: member.email })}>
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem>Change role</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Remove from team</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// TanStack Table v9 (as used by shadcn's current data table example): declare features up front.
const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

const columnHelper = createColumnHelper<typeof features, Member>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Member
        <ArrowUpDownIcon data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </div>
      </div>
    ),
    filterFn: (row, _id, value) =>
      `${row.original.name} ${row.original.email} ${row.original.role}`.toLowerCase().includes(String(value).toLowerCase()),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "Owner" ? "default" : row.original.role === "Admin" ? "secondary" : "outline"}>
        {row.original.role}
      </Badge>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status
      return (
        <span className="flex items-center gap-1.5 text-sm">
          <span
            className={
              s === "Active"
                ? "bg-primary size-1.5 rounded-full"
                : s === "Invited"
                  ? "bg-muted-foreground size-1.5 rounded-full"
                  : "bg-destructive size-1.5 rounded-full"
            }
          />
          {s}
        </span>
      )
    },
  }),
  columnHelper.accessor("seats", {
    header: () => <div className="text-right">Seats</div>,
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{row.original.seats}</div>,
  }),
  columnHelper.display({ id: "actions", cell: ({ row }) => <RowActions member={row.original} /> }),
])

export function TeamTablePreview() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({ "1": true })
  const table = useTable({
    features,
    data: MEMBERS,
    columns,
    getRowId: (r) => r.id,
    state: { sorting, columnFilters, rowSelection },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  const filter = (table.getColumn("name")?.getFilterValue() as string) ?? ""

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team management</CardTitle>
        <CardDescription>Data Table: TanStack Table with shadcn Table, Checkbox, Dropdown Menu.</CardDescription>
        <CardAction>
          <Button size="sm">
            <UserPlusIcon data-icon="inline-start" />
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Filter members…" value={filter} onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)} />
        </InputGroup>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className={h.column.id === "select" ? "w-8" : undefined}>
                      {h.isPlaceholder ? null : <table.FlexRender header={h} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-muted-foreground h-20 text-center">
                    No members match “{filter}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="text-muted-foreground text-xs">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
