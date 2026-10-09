import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
const SERIES = ["web", "ios", "android", "api", "other"] as const

// Deterministic data so screenshots and comparisons are stable.
const trafficData = MONTHS.map((month, i) => ({
  month,
  web: 180 + Math.round(60 * Math.sin(i / 1.4)) + i * 14,
  ios: 120 + Math.round(40 * Math.cos(i / 1.8)) + i * 9,
  android: 90 + Math.round(30 * Math.sin(i / 1.1 + 1)) + i * 7,
  api: 60 + Math.round(20 * Math.cos(i / 1.3 + 2)) + i * 5,
  other: 30 + Math.round(12 * Math.sin(i / 0.9)) + i * 3,
}))

const config = {
  web: { label: "Web", color: "var(--chart-1)" },
  ios: { label: "iOS", color: "var(--chart-2)" },
  android: { label: "Android", color: "var(--chart-3)" },
  api: { label: "API", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

const shareData = SERIES.map((key, i) => ({ source: key, visitors: [420, 310, 220, 140, 80][i], fill: `var(--color-${key})` }))

export function ChartsPreview() {
  const total = React.useMemo(() => shareData.reduce((sum, d) => sum + d.visitors, 0), [])
  return (
    <div className="grid gap-4 @4xl:grid-cols-3">
      <Card className="@4xl:col-span-2">
        <CardHeader>
          <CardTitle>Traffic by platform</CardTitle>
          <CardDescription>Stacked area chart using chart-1 through chart-5.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="aspect-auto h-64 w-full">
            <AreaChart data={trafficData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              {[...SERIES].reverse().map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  stackId="a"
                  fill={`var(--color-${key})`}
                  fillOpacity={0.35}
                  stroke={`var(--color-${key})`}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <CardTitle>Visitor share</CardTitle>
          <CardDescription>Donut chart.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={config} className="mx-auto aspect-square max-h-60">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="source" />} />
              <Pie data={shareData} dataKey="visitors" nameKey="source" innerRadius={58} strokeWidth={4} stroke="var(--card)">
                <Label
                  content={({ viewBox }) =>
                    viewBox && "cx" in viewBox && "cy" in viewBox ? (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-semibold">
                          {total.toLocaleString("en-US")}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                          Visitors
                        </tspan>
                      </text>
                    ) : null
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="text-muted-foreground justify-center text-xs">Last 30 days</CardFooter>
      </Card>
      <Card className="@4xl:col-span-2">
        <CardHeader>
          <CardTitle>Requests per month</CardTitle>
          <CardDescription>Grouped bar chart.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="aspect-auto h-56 w-full">
            <BarChart data={trafficData.slice(-5)}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              {SERIES.map((key) => (
                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latency</CardTitle>
          <CardDescription>Line chart, p50 vs p95.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="aspect-auto h-56 w-full">
            <LineChart data={trafficData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line dataKey="web" type="monotone" stroke="var(--color-web)" strokeWidth={2} dot={false} />
              <Line dataKey="ios" type="monotone" stroke="var(--color-ios)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
