"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import DateRangePicker from "@/components/dashboard/date-range-picker"
import CampaignPerformance from "@/components/dashboard/campaign-performance"
import { useData, useFilteredData, Filters } from '@/hooks/use-data';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfDay } from 'date-fns';

export default function CampaignPerformanceTab() {
  const { data: rawData, loading: rawLoading } = useData();
  const [filters, setFilters] = useState<Filters>({});

  const { data: filteredData, loading: filteredLoading } = useFilteredData(filters);

  useEffect(() => {
    // Set initial date range on client to avoid hydration mismatch
    setFilters(prev => ({
        ...prev,
        dateRange: {
          from: startOfMonth(new Date(2025, 6, 1)),
          to: endOfDay(new Date()),
        }
    }));
  }, []);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleProductsChange = (products: string[]) => {
    setFilters(prev => ({ ...prev, products }));
  };
  
  const handleProjectsChange = (projects: string[]) => {
    setFilters(prev => ({ ...prev, projects }));
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <DateRangePicker value={filters.dateRange} onValueChange={handleDateChange} />
          <MultiSelect
              options={rawData.distinctProducts.map(p => ({value: p, label: p}))}
              selected={filters.products || []}
              onChange={handleProductsChange}
              className="w-full md:w-[200px]"
              placeholder="All Products"
          />
          <MultiSelect
              options={rawData.distinctProjects.map(p => ({value: p, label: p}))}
              selected={filters.projects || []}
              onChange={handleProjectsChange}
              className="w-full md:w-[200px]"
              placeholder="All Projects"
          />
        </CardContent>
      </Card>
      
      <CampaignPerformance data={filteredData.campaign} loading={rawLoading || filteredLoading} />
    </div>
  )
}
