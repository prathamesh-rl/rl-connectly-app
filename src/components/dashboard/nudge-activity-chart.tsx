"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ActivityData } from "@/hooks/use-data"
import { Loader2 } from "lucide-react"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts"

const chartConfig = {
  inactive: { label: "Inactive", color: "hsl(var(--chart-2))" },
  active: { label: "Active", color: "hsl(var(--chart-1))" },
  highly_active: { label: "Highly Active", color: "hsl(var(--chart-4))" },
}

interface NudgeActivityChartProps {
  data: ActivityData[];
  loading: boolean;
}

export default function NudgeActivityChart({ data, loading }: NudgeActivityChartProps) {
  
  const chartData = useMemo(() => {
    const nudgeBins: Record<string, { inactive: number, active: number, highly_active: number }> = {
        "1-2": { inactive: 0, active: 0, highly_active: 0 },
        "3-4": { inactive: 0, active: 0, highly_active: 0 },
        "5-6": { inactive: 0, active: 0, highly_active: 0 },
        "7-8": { inactive: 0, active: 0, highly_active: 0 },
        "9+": { inactive: 0, active: 0, highly_active: 0 },
    };

    data.forEach(item => {
        let bin: string;
        if (item.nudges_sent <= 2) bin = "1-2";
        else if (item.nudges_sent <= 4) bin = "3-4";
        else if (item.nudges_sent <= 6) bin = "5-6";
        else if (item.nudges_sent <= 8) bin = "7-8";
        else bin = "9+";

        nudgeBins[bin][item.activity_level] += 1;
    });
    
    return Object.entries(nudgeBins).map(([nudge, counts]) => ({
      nudge,
      ...counts
    }));

  }, [data]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nudge Frequency vs. Activity</CardTitle>
        <CardDescription>Activity distribution based on nudge frequency.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-[350px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
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
            <Bar dataKey="inactive" stackId="a" fill="var(--color-inactive)" radius={[4, 0, 0, 4]} />
            <Bar dataKey="active" stackId="a" fill="var(--color-active)" />
            <Bar dataKey="highly_active" stackId="a" fill="var(--color-highly_active)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
