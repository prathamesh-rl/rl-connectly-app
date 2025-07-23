"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { CampaignData } from '@/hooks/use-data';

type AggregatedData = { name: string; sent: number; delivered: number; };
type SortKey = 'name' | 'sent' | 'delivered' | 'rate';
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: AggregatedData[], initialConfig: { key: SortKey; direction: SortDirection } | null = null) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key === 'rate' ? (a.sent > 0 ? a.delivered / a.sent : 0) : a[sortConfig.key];
        const bValue = sortConfig.key === 'rate' ? (b.sent > 0 ? b.delivered / b.sent : 0) : b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const SortableHeader = ({ children, sortKey, requestSort, sortConfig }: { children: React.ReactNode, sortKey: SortKey, requestSort: (key: SortKey) => void, sortConfig: any }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => requestSort(sortKey)}>
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

const FunnelTable = ({ data, nameKey, nameHeader, loading }: {data: AggregatedData[], nameKey: 'product' | 'project', nameHeader: string, loading: boolean}) => {
  const { items, requestSort, sortConfig } = useSortableData(data, { key: 'name', direction: 'asc' });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Table>
        <TableCaption>Delivery funnel metrics aggregated by {nameHeader}.</TableCaption>
      <TableHeader>
        <TableRow>
          <SortableHeader sortKey="name" requestSort={requestSort} sortConfig={sortConfig}>{nameHeader}</SortableHeader>
          <SortableHeader sortKey="sent" requestSort={requestSort} sortConfig={sortConfig}>Sent</SortableHeader>
          <SortableHeader sortKey="delivered" requestSort={requestSort} sortConfig={sortConfig}>Delivered</SortableHeader>
          <SortableHeader sortKey="rate" requestSort={requestSort} sortConfig={sortConfig}>Delivery Rate</SortableHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? items.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.sent.toLocaleString()}</TableCell>
            <TableCell>{item.delivered.toLocaleString()}</TableCell>
            <TableCell>{(item.delivered && item.sent ? item.delivered / item.sent * 100 : 0).toFixed(2)}%</TableCell>
          </TableRow>
        )) : <TableRow><TableCell colSpan={4} className="text-center h-24">No data available for the selected filters.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
};

interface FunnelAnalysisProps {
  data: CampaignData[];
  loading: boolean;
  by: 'product' | 'project';
}

export default function FunnelAnalysis({ data, loading, by }: FunnelAnalysisProps) {
    const aggregate = (key: 'product' | 'project') => {
        const aggregation: Record<string, {name: string, sent: number, delivered: number}> = {};

        data.forEach(item => {
            const name = item[key];
            if(!aggregation[name]){
                aggregation[name] = { name, sent: 0, delivered: 0 };
            }
            aggregation[name].sent += item.sent;
            aggregation[name].delivered += item.delivered;
        })
        return Object.values(aggregation);
    }

    const aggregatedData = useMemo(() => aggregate(by), [data, by]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Analysis by {by.charAt(0).toUpperCase() + by.slice(1)}</CardTitle>
        <CardDescription>
          View sent and delivered metrics, sortable by different criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FunnelTable data={aggregatedData} nameKey={by} nameHeader={by.charAt(0).toUpperCase() + by.slice(1)} loading={loading} />
      </CardContent>
    </Card>
  )
}
