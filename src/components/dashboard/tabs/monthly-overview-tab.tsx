"use client"
import React from 'react';
import MonthlyOverview from "@/components/dashboard/monthly-overview"
import { useFilteredData } from '@/hooks/use-data';

export default function MonthlyOverviewTab() {
  const { data, loading } = useFilteredData({});
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <MonthlyOverview data={data.monthly} loading={loading} />
    </div>
  )
}
