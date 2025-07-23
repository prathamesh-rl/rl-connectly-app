"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
        const aValue = sortConfig.key === 'rate' ? (a.delivered / a.sent) : a[sortConfig.key];
        const bValue = sortConfig.key === 'rate' ? (b.delivered / b.sent) : b[sortConfig.key];
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

  return { items: sortedItems, requestSort };
};


const SortableHeader = ({ children, sortKey, requestSort }: { children: React.ReactNode, sortKey: SortKey, requestSort: (key: SortKey) => void }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => requestSort(sortKey)}>
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

const FunnelTable = ({ data, nameKey, nameHeader }: {data: AggregatedData[], nameKey: 'product' | 'project', nameHeader: string}) => {
  const { items, requestSort } = useSortableData(data, { key: 'name', direction: 'asc' });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader sortKey="name" requestSort={requestSort}>{nameHeader}</SortableHeader>
          <SortableHeader sortKey="sent" requestSort={requestSort}>Sent</SortableHeader>
          <SortableHeader sortKey="delivered" requestSort={requestSort}>Delivered</SortableHeader>
          <SortableHeader sortKey="rate" requestSort={requestSort}>Delivery Rate</SortableHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? items.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.sent.toLocaleString()}</TableCell>
            <TableCell>{item.delivered.toLocaleString()}</TableCell>
            <TableCell>{(item.delivered / item.sent * 100).toFixed(2)}%</TableCell>
          </TableRow>
        )) : <TableRow><TableCell colSpan={4} className="text-center">No data available.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
};


interface FunnelAnalysisProps {
  data: CampaignData[];
  loading: boolean;
}

export default function FunnelAnalysis({ data, loading }: FunnelAnalysisProps) {
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

    const byProduct = useMemo(() => aggregate('product'), [data]);
    const byProject = useMemo(() => aggregate('project'), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Analysis</CardTitle>
        <CardDescription>
          View sent and delivered metrics, sortable by different criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
      {loading ? (
          <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      ) : (
        <Tabs defaultValue="product">
          <TabsList>
            <TabsTrigger value="product">By Product</TabsTrigger>
            <TabsTrigger value="project">By Project</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <FunnelTable data={byProduct} nameKey="product" nameHeader="Product" />
          </TabsContent>
          <TabsContent value="project">
            <FunnelTable data={byProject} nameKey="project" nameHeader="Project" />
          </TabsContent>
        </Tabs>
      )}
      </CardContent>
    </Card>
  )
}
