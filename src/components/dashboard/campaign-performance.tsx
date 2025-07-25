"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { CampaignData } from '@/hooks/use-data';

type SortKey = 'campaignName' | 'sent' | 'delivered' | 'deliveryRate' | 'clickRate' | 'cost';
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: CampaignData[], initialConfig: { key: SortKey; direction: SortDirection } | null = null) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'deliveryRate':
            aValue = a.sent > 0 ? a.delivered / a.sent : 0;
            bValue = b.sent > 0 ? b.delivered / b.sent : 0;
            break;
          case 'clickRate':
            aValue = a.delivered > 0 ? (a.clicks || 0) / a.delivered : 0;
            bValue = b.delivered > 0 ? (b.clicks || 0) / b.delivered : 0;
            break;
          default:
            aValue = a[sortConfig.key as keyof CampaignData];
            bValue = b[sortConfig.key as keyof CampaignData];
        }
        
        if(typeof aValue === 'undefined' || aValue === null) aValue = 0;
        if(typeof bValue === 'undefined' || bValue === null) bValue = 0;

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue.toString()) * (sortConfig.direction === 'asc' ? 1 : -1);
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


const SortableHeader = ({ children, sortKey, requestSort, sortConfig, className }: { children: React.ReactNode, sortKey: SortKey, requestSort: (key: SortKey) => void, sortConfig: {key: SortKey, direction: SortDirection} | null, className?: string }) => (
  <TableHead className={className}>
    <Button variant="ghost" onClick={() => requestSort(sortKey)}>
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </TableHead>
);

const CampaignRow = ({ item }: { item: CampaignData }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <React.Fragment>
            <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              <TableCell className="font-medium">
                  <Button variant="ghost" size="icon" className="h-8 w-8 mr-2 -ml-2">
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="sr-only">Toggle details</span>
                  </Button>
                  {item.campaignName}
              </TableCell>
              <TableCell className="text-right">{(item.sent || 0).toLocaleString()}</TableCell>
              <TableCell className="text-right">{(item.delivered || 0).toLocaleString()}</TableCell>
              <TableCell className="text-right">{(item.sent > 0 ? (item.delivered / item.sent) * 100 : 0).toFixed(1)}%</TableCell>
              <TableCell className="text-right">{((item.clicks || 0) / (item.delivered || 1) * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-right">${(item.cost || 0).toFixed(2)}</TableCell>
            </TableRow>
            {isOpen && (
                <TableRow>
                    <TableCell colSpan={6} className="p-4 bg-muted/50">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Delivery Stats</h4>
                                <p className="text-xs text-muted-foreground">Sent: {item.sent.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Delivered: {item.delivered.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Clicks: {(item.clicks || 0).toLocaleString()}</p>
                            </div>
                           <div>
                                <h4 className="font-semibold mb-1 text-sm">Product</h4>
                                <p className="text-xs text-muted-foreground">{item.product}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1 text-sm">Project</h4>
                                <p className="text-xs text-muted-foreground">{item.project}</p>
                            </div>
                       </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    )
}

interface CampaignPerformanceProps {
  data: CampaignData[];
  loading: boolean;
}

export default function CampaignPerformance({ data, loading }: CampaignPerformanceProps) {
  const aggregatedData = useMemo(() => {
    const campaigns: Record<string, CampaignData> = {};
    data.forEach(row => {
        if (!row.campaignName) return;
        const key = row.campaignName + row.product + row.project;
        if(!campaigns[key]) {
            campaigns[key] = {...row, sent: 0, delivered: 0, clicks: 0, cost: 0};
        }
        campaigns[key].sent += row.sent;
        campaigns[key].delivered += row.delivered;
        campaigns[key].clicks = (campaigns[key].clicks || 0) + (row.clicks || 0);
        campaigns[key].cost = (campaigns[key].cost || 0) + (row.cost || 0);
    });
    return Object.values(campaigns);
  }, [data])
  const { items, requestSort, sortConfig } = useSortableData(aggregatedData, { key: 'campaignName', direction: 'asc' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>
          Detailed campaign metrics with sortable columns and expandable rows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableCaption>Click on a row to see more details.</TableCaption>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="campaignName" requestSort={requestSort} sortConfig={sortConfig}>Campaign</SortableHeader>
                  <SortableHeader sortKey="sent" requestSort={requestSort} sortConfig={sortConfig} className="text-right">Sent</SortableHeader>
                  <SortableHeader sortKey="delivered" requestSort={requestSort} sortConfig={sortConfig} className="text-right">Delivered</SortableHeader>
                  <SortableHeader sortKey="deliveryRate" requestSort={requestSort} sortConfig={sortConfig} className="text-right">Delivery Rate</SortableHeader>
                  <SortableHeader sortKey="clickRate" requestSort={requestSort} sortConfig={sortConfig} className="text-right">Click Rate</SortableHeader>
                  <SortableHeader sortKey="cost" requestSort={requestSort} sortConfig={sortConfig} className="text-right">Cost</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? items.map((item, index) => (
                  <CampaignRow key={`${item.campaignName}-${item.product}-${item.project}-${index}`} item={item} />
                )) : <TableRow><TableCell colSpan={6} className="text-center h-24">No data available for the selected filters.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
