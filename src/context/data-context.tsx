
"use client"

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchAndDecompress, DataState } from '@/hooks/use-data';

export const DataContext = createContext<{data: DataState, loading: boolean} | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const [data, setData] = useState<DataState>({ campaign: [], activity: [], monthly: [], distinctProducts: [], distinctProjects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [campaign, activity, monthly] = await Promise.all([
                fetchAndDecompress('/data/camp_user.json.gz', toast),
                fetchAndDecompress('/data/act.json.gz', toast),
                fetchAndDecompress('/data/monthly_metrics.json.gz', toast)
            ]);

            const distinctProducts = [...new Set(campaign.map((d: any) => d.product))].sort();
            const distinctProjects = [...new Set(campaign.map((d: any) => d.project))].sort();

            setData({ campaign, activity, monthly, distinctProducts, distinctProjects });
            setLoading(false);
        };
        loadData();
    }, [toast]);

    return (
        <DataContext.Provider value={{ data, loading }}>
            {children}
        </DataContext.Provider>
    )
}
