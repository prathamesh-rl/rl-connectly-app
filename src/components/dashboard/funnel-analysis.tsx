"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

const productData = [
  { product: "Product A", sent: 10000, delivered: 9500 },
  { product: "Product B", sent: 12000, delivered: 11800 },
  { product: "Product C", sent: 8000, delivered: 7200 },
  { product: "Product D", sent: 15000, delivered: 14500 },
];

const projectData = [
  { project: "Project Alpha", sent: 25000, delivered: 23000 },
  { project: "Project Beta", sent: 18000, delivered: 17500 },
  { project: "Project Gamma", sent: 22000, delivered: 21000 },
];

type DataItem = { sent: number; delivered: number; [key: string]: any };
type SortKey = 'product' | 'project' | 'sent' | 'delivered' | 'rate';
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: DataItem[], initialConfig: { key: SortKey; direction: SortDirection } | null = null) => {
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

const ProductTable = () => {
  const { items, requestSort } = useSortableData(productData);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader sortKey="product" requestSort={requestSort}>Product</SortableHeader>
          <SortableHeader sortKey="sent" requestSort={requestSort}>Sent</SortableHeader>
          <SortableHeader sortKey="delivered" requestSort={requestSort}>Delivered</SortableHeader>
          <SortableHeader sortKey="rate" requestSort={requestSort}>Delivery Rate</SortableHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.product}>
            <TableCell className="font-medium">{item.product}</TableCell>
            <TableCell>{item.sent.toLocaleString()}</TableCell>
            <TableCell>{item.delivered.toLocaleString()}</TableCell>
            <TableCell>{(item.delivered / item.sent * 100).toFixed(2)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ProjectTable = () => {
    const { items, requestSort } = useSortableData(projectData);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableHeader sortKey="project" requestSort={requestSort}>Project</SortableHeader>
                    <SortableHeader sortKey="sent" requestSort={requestSort}>Sent</SortableHeader>
                    <SortableHeader sortKey="delivered" requestSort={requestSort}>Delivered</SortableHeader>
                    <SortableHeader sortKey="rate" requestSort={requestSort}>Delivery Rate</SortableHeader>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.project}>
                        <TableCell className="font-medium">{item.project}</TableCell>
                        <TableCell>{item.sent.toLocaleString()}</TableCell>
                        <TableCell>{item.delivered.toLocaleString()}</TableCell>
                        <TableCell>{(item.delivered / item.sent * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function FunnelAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Analysis</CardTitle>
        <CardDescription>
          View sent and delivered metrics, sortable by different criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="product">
          <TabsList>
            <TabsTrigger value="product">By Product</TabsTrigger>
            <TabsTrigger value="project">By Project</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <ProductTable />
          </TabsContent>
          <TabsContent value="project">
            <ProjectTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
