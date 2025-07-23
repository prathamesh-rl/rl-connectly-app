"use client"

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchAndDecompress, DataState, RawData } from '@/hooks/use-data';

export const DataContext = createContext<{data: DataState, loading: boolean} | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const [rawData, setRawData] = useState<RawData>({ campaign: [], activity: [], monthly: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [campaign, activity, monthly] = await Promise.all([
                    fetchAndDecompress('/data/camp_user.json.gz', toast),
                    fetchAndDecompress('/data/act.json.gz', toast),
                    fetchAndDecompress('/data/monthly_metrics.json.gz', toast)
                ]);
                setRawData({ campaign, activity, monthly });
            } catch (error) {
                console.error("Error loading initial data", error);
                toast({
                    variant: "destructive",
                    title: "Fatal Error",
                    description: "Could not load required data files. The dashboard may not function correctly.",
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [toast]);

    const processedData = useMemo<DataState>(() => {
        const distinctProducts = [...new Set(rawData.campaign.map((d: any) => d.product))].sort();
        const distinctProjects = [...new Set(rawData.campaign.map((d: any) => d.project))].sort();

        return {
            ...rawData,
            distinctProducts,
            distinctProjects,
        };
    }, [rawData]);

    return (
        <DataContext.Provider value={{ data: processedData, loading }}>
            {children}
        </DataContext.Provider>
    );
}
