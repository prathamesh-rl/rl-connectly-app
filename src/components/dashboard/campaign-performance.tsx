
"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import campaignData from '@/data/campaign-perf.json';

type Campaign = {
  campaignName: string;
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

type SortKey = keyof Campaign | 'deliveryRate' | 'clickRate';
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
            aValue = a.delivered / a.sent;
            bValue = b.delivered / b.sent;
            break;
          case 'clickRate':
            aValue = a.clicks / a.delivered;
            bValue = b.clicks / b.delivered;
            break;
          default:
            aValue = a[sortConfig.key as keyof Campaign];
            bValue = b[sortConfig.key as keyof Campaign];
        }

        if (typeof aValue === 'object') return 0;

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

const SortableHeader = ({ children, sortKey, requestSort }: { children: React.ReactNode, sortKey: SortKey, requestSort: (key: SortKey) => void }) => (
  <TableHead>
    <Button variant="ghost" onClick={() => requestSort(sortKey)}>
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </TableHead>
);

const CampaignRow = ({ item }: { item: Campaign }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
        <>
            <TableRow>
            <TableCell>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="sr-only">Toggle details</span>
                    </Button>
                </CollapsibleTrigger>
                {item.campaignName}
            </TableCell>
            <TableCell>{item.sent.toLocaleString()}</TableCell>
            <TableCell>{item.delivered.toLocaleString()}</TableCell>
            <TableCell>{(item.delivered / item.sent * 100).toFixed(1)}%</TableCell>
            <TableCell>{(item.clicks / item.delivered * 100).toFixed(1)}%</TableCell>
            <TableCell>${item.cost.toFixed(2)}</TableCell>
            <TableCell>{item.activity.inactive.toFixed(1)}%</TableCell>
            <TableCell>{item.activity.active.toFixed(1)}%</TableCell>
            <TableCell>{item.activity.highlyActive.toFixed(1)}%</TableCell>
            <TableCell>
                Low: {item.frequency.low.toLocaleString()}<br />
                Med: {item.frequency.medium.toLocaleString()}<br />
                High: {item.frequency.high.toLocaleString()}
            </TableCell>
            </TableRow>
            <CollapsibleContent asChild>
                <TableRow>
                    <TableCell colSpan={10} className="p-4 bg-muted/50">
                        <p className="font-semibold">Details:</p>
                        <p>{item.details}</p>
                    </TableCell>
                </TableRow>
            </CollapsibleContent>
        </>
        </Collapsible>
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
            <TableCaption>Detailed campaign metrics</TableCaption>
            <TableHeader>
              <TableRow>
                <SortableHeader sortKey="campaignName" requestSort={requestSort}>Campaign Name</SortableHeader>
                <SortableHeader sortKey="sent" requestSort={requestSort}>Sent</SortableHeader>
                <SortableHeader sortKey="delivered" requestSort={requestSort}>Delivered</SortableHeader>
                <SortableHeader sortKey="deliveryRate" requestSort={requestSort}>Delivery Rate</SortableHeader>
                <SortableHeader sortKey="clickRate" requestSort={requestSort}>Click Rate</SortableHeader>
                <SortableHeader sortKey="cost" requestSort={requestSort}>Cost</SortableHeader>
                <SortableHeader sortKey="activity" requestSort={requestSort}>Inactive %</SortableHeader>
                <SortableHeader sortKey="activity" requestSort={requestSort}>Active %</SortableHeader>
                <SortableHeader sortKey="activity" requestSort={requestSort}>Highly Active %</SortableHeader>
                <TableHead>Frequency</TableHead>
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
