"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts"

const chartData = [
  { nudge: "1-2", low: 4000, medium: 2400, high: 1200 },
  { nudge: "3-4", low: 3000, medium: 1398, high: 2210 },
  { nudge: "5-6", low: 2000, medium: 9800, high: 2290 },
  { nudge: "7-8", low: 2780, medium: 3908, high: 2000 },
  { nudge: "9+", low: 1890, medium: 4800, high: 2181 },
]

const chartConfig = {
  low: { label: "Low Activity", color: "hsl(var(--chart-2))" },
  medium: { label: "Medium Activity", color: "hsl(var(--chart-1))" },
  high: { label: "High Activity", color: "hsl(var(--chart-4))" },
}

export default function NudgeActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nudge Frequency vs. Activity</CardTitle>
        <CardDescription>Activity distribution based on nudge frequency.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" stackOffset="expand">
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="nudge"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend align="center" verticalAlign="top" iconType="circle" />
            <Bar dataKey="low" stackId="a" fill="var(--color-low)" radius={[4, 0, 0, 4]} />
            <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" />
            <Bar dataKey="high" stackId="a" fill="var(--color-high)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
