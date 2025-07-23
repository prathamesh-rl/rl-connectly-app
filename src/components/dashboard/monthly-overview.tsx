"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MonthlyData } from "@/hooks/use-data"
import { Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"

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

interface MonthlyOverviewProps {
  data: MonthlyData[];
  loading: boolean;
}

export default function MonthlyOverview({ data, loading }: MonthlyOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Delivered counts and associated costs per month.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
            <div className="lg:col-span-2 flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivered Count</h3>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={data}>
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
                <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
