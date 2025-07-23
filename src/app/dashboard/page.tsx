import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DateRangePicker from "@/components/dashboard/date-range-picker"
import MonthlyOverview from "@/components/dashboard/monthly-overview"
import FunnelAnalysis from "@/components/dashboard/funnel-analysis"
import NudgeActivityChart from "@/components/dashboard/nudge-activity-chart"
import AlertSetupDialog from "@/components/dashboard/alert-setup-dialog"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <AlertSetupDialog />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <DateRangePicker />
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product1">Product 1</SelectItem>
              <SelectItem value="product2">Product 2</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project1">Project A</SelectItem>
              <SelectItem value="project2">Project B</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full md:w-auto md:ml-auto">Filter</Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-8">
        <MonthlyOverview />
        <FunnelAnalysis />
        <NudgeActivityChart />
      </div>
    </div>
  )
}
