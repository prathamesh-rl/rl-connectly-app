
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import DateRangePicker from "@/components/dashboard/date-range-picker"
import FunnelAnalysis from "@/components/dashboard/funnel-analysis"
import NudgeActivityChart from "@/components/dashboard/nudge-activity-chart"
import { useData, useFilteredData, Filters } from '@/hooks/use-data';
import { DateRange } from 'react-day-picker';
import { endOfDay, startOfMonth } from 'date-fns';

export default function ProductViewTab() {
  const { data: rawData, loading: rawLoading } = useData();
  const [filters, setFilters] = useState<Filters>({});

  const { data: filteredData, loading: filteredLoading } = useFilteredData(filters);

  useEffect(() => {
    // Set initial date range on client to avoid hydration mismatch
    setFilters({
        dateRange: {
          from: new Date(2025, 6, 1), // July 1st, 2025
          to: endOfDay(new Date(2025, 8, 30)), // End of Sep 30, 2025
        },
        products: [],
    });
  }, []);
  
  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleProductsChange = (products: string[]) => {
    setFilters(prev => ({ ...prev, products }));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center flex-wrap">
          <DateRangePicker value={filters.dateRange} onValueChange={handleDateChange} />
          <MultiSelect
              options={rawData.distinctProducts.map(p => ({value: p, label: p}))}
              selected={filters.products || []}
              onChange={handleProductsChange}
              className="w-full md:w-[200px]"
              placeholder="All Products"
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FunnelAnalysis data={filteredData.campaign} loading={rawLoading || filteredLoading} by="product" />
        <NudgeActivityChart data={filteredData.activity} loading={rawLoading || filteredLoading} />
      </div>
    </div>
  )
}
