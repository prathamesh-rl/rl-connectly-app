"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import DateRangePicker from "@/components/dashboard/date-range-picker"
import FunnelAnalysis from "@/components/dashboard/funnel-analysis"
import { useData, useFilteredData, Filters } from '@/hooks/use-data';
import { DateRange } from 'react-day-picker';
import { endOfDay } from 'date-fns';

export default function ProjectViewTab() {
  const { data: rawData, loading: rawLoading } = useData();
  const [filters, setFilters] = useState<Filters>({});

  const { data: filteredData, loading: filteredLoading } = useFilteredData(filters);

  useEffect(() => {
    setFilters({
        dateRange: {
          from: new Date(2025, 6, 1),
          to: endOfDay(new Date()),
        },
        projects: [],
    });
  }, []);
  
  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleProjectsChange = (projects: string[]) => {
    setFilters(prev => ({ ...prev, projects }));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center flex-wrap">
          <DateRangePicker value={filters.dateRange} onValueChange={handleDateChange} />
          <MultiSelect
              options={rawData.distinctProjects.map(p => ({value: p, label: p}))}
              selected={filters.projects || []}
              onChange={handleProjectsChange}
              className="w-full md:w-[200px]"
              placeholder="All Projects"
          />
        </CardContent>
      </Card>
      
      <FunnelAnalysis data={filteredData.campaign} loading={rawLoading || filteredLoading} by="project" />
    </div>
  )
}
