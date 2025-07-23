
"use client"
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import DateRangePicker from "@/components/dashboard/date-range-picker"
import MonthlyOverview from "@/components/dashboard/monthly-overview"
import FunnelAnalysis from "@/components/dashboard/funnel-analysis"
import NudgeActivityChart from "@/components/dashboard/nudge-activity-chart"
import AlertSetupDialog from "@/components/dashboard/alert-setup-dialog"
import CampaignPerformance from "@/components/dashboard/campaign-performance"
import { useData } from '@/hooks/use-data';
import { DateRange } from 'react-day-picker';
import { addDays, startOfMonth } from 'date-fns';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date(2025, 6, 1)),
    to: new Date(),
  });
  const [products, setProducts] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [filters, setFilters] = useState({ dateRange, products, projects });

  const { data, loading, error, distinctProducts, distinctProjects } = useData(filters);

  const handleFilter = () => {
    setFilters({ dateRange, products, projects });
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <AlertSetupDialog />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <DateRangePicker value={dateRange} onValueChange={setDateRange} />
          <MultiSelect
              options={distinctProducts.map(p => ({value: p, label: p}))}
              selected={products}
              onChange={setProducts}
              className="w-full md:w-[180px]"
              placeholder="All Products"
          />
          <MultiSelect
              options={distinctProjects.map(p => ({value: p, label: p}))}
              selected={projects}
              onChange={setProjects}
              className="w-full md:w-[180px]"
              placeholder="All Projects"
          />
          <Button onClick={handleFilter} className="w-full md:w-auto md:ml-auto">Filter</Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-8">
        <MonthlyOverview data={data.monthly} loading={loading} />
        <FunnelAnalysis data={data.campaign} loading={loading}/>
        <CampaignPerformance data={data.campaign} loading={loading} />
        <NudgeActivityChart data={data.activity} loading={loading} />
      </div>
    </div>
  )
}
