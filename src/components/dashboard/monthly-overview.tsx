"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend } from "recharts"

const chartData = [
  { month: "January", delivered: 1860, cost: 800 },
  { month: "February", delivered: 3050, cost: 1200 },
  { month: "March", delivered: 2370, cost: 980 },
  { month: "April", delivered: 2730, cost: 1100 },
  { month: "May", delivered: 2090, cost: 850 },
  { month: "June", delivered: 2140, cost: 900 },
]

const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--primary))",
  },
  cost: {
    label: "Cost ($)",
    color: "hsl(var(--accent))",
  },
}

export default function MonthlyOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Delivered counts and associated costs per month.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Delivered Count</h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Costs</h3>
           <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line type="monotone" dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
