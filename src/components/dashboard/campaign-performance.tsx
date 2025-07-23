
"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import campaignData from '@/data/campaign-perf.json';
import { Badge } from '@/components/ui/badge';

type Campaign = {
  campaignName: string;
  product: string;
  project: string;
  sent: number;
  delivered: number;
  clicks: number;
  cost: number;
  activity: {
    inactive: number;
    active: number;
    highlyActive: number;
  };
  frequency: {
    low: number;
    medium: number;
    high: number;
  };
  details: string;
};

type SortKey = keyof Campaign | 'deliveryRate' | 'clickRate' | 'cost';
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: Campaign[], initialConfig: { key: SortKey; direction: SortDirection } | null = null) => {
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
            aValue = a.delivered > 0 ? a.clicks / a.delivered : 0;
            bValue = b.delivered > 0 ? b.clicks / b.delivered : 0;
            break;
          default:
            aValue = a[sortConfig.key as keyof Campaign];
            bValue = b[sortConfig.key as keyof Campaign];
        }

        if (typeof aValue === 'string') {
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

const SortableHeader = ({ children, sortKey, requestSort, className }: { children: React.ReactNode, sortKey: SortKey, requestSort: (key: SortKey) => void, className?: string }) => (
  <TableHead className={className}>
    <Button variant="ghost" onClick={() => requestSort(sortKey)}>
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </TableHead>
);

const CampaignRow = ({ item }: { item: Campaign }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <React.Fragment>
            <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="sr-only">Toggle details</span>
                  </Button>
                  {item.campaignName}
              </TableCell>
              <TableCell className="text-right">{(item.delivered / item.sent * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-right">{(item.clicks / item.delivered * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
            </TableRow>
            {isOpen && (
                <TableRow>
                    <TableCell colSpan={4} className="p-4 bg-muted/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Delivery Stats</h4>
                            <p className="text-xs">Sent: {item.sent.toLocaleString()}</p>
                            <p className="text-xs">Delivered: {item.delivered.toLocaleString()}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">User Activity</h4>
                            <div className="flex flex-col gap-1 text-xs">
                              <p>Inactive: {item.activity.inactive.toFixed(1)}%</p>
                              <p>Active: {item.activity.active.toFixed(1)}%</p>
                              <p>Highly Active: {item.activity.highlyActive.toFixed(1)}%</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Frequency</h4>
                             <div className="flex flex-col gap-1 text-xs">
                                <p>Low: {item.frequency.low.toLocaleString()}</p>
                                <p>Medium: {item.frequency.medium.toLocaleString()}</p>
                                <p>High: {item.frequency.high.toLocaleString()}</p>
                             </div>
                          </div>
                           <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-1 text-sm">Product</h4>
                                    <p className="text-xs text-muted-foreground">{item.product}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 text-sm">Project</h4>
                                    <p className="text-xs text-muted-foreground">{item.project}</p>
                                </div>
                           </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    )
}


export default function CampaignPerformance() {
  const { items, requestSort } = useSortableData(campaignData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>
          Detailed campaign metrics with sortable columns and expandable rows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableCaption>Click on a row to see more details.</TableCaption>
            <TableHeader>
              <TableRow>
                <SortableHeader sortKey="campaignName" requestSort={requestSort}>Campaign Name</SortableHeader>
                <SortableHeader sortKey="deliveryRate" requestSort={requestSort} className="text-right">Delivery Rate</SortableHeader>
                <SortableHeader sortKey="clickRate" requestSort={requestSort} className="text-right">Click Rate</SortableHeader>
                <SortableHeader sortKey="cost" requestSort={requestSort} className="text-right">Cost</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <CampaignRow key={item.campaignName} item={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
