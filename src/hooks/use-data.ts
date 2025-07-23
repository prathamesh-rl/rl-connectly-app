
"use client"

import { useState, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';
import pako from 'pako';
import { useToast } from './use-toast';
import { DateRange } from 'react-day-picker';
import { format, isValid, startOfMonth, endOfDay } from 'date-fns';

export interface CampaignData {
    date: string;
    product: string;
    project: string;
    campaignName: string;
    sent: number;
    delivered: number;
    clicks?: number;
    cost?: number;
}

export interface ActivityData {
    date: string;
    product: string;
    project: string;
    activity_level: 'inactive' | 'active' | 'highly_active';
    nudges_sent: number;
}

export interface MonthlyData {
    month: string;
    delivered: number;
    cost: number;
}

interface DataState {
    campaign: CampaignData[];
    activity: ActivityData[];
    monthly: MonthlyData[];
    distinctProducts: string[];
    distinctProjects: string[];
}

const fetchAndDecompress = async (url: string, toast: any) => {
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Failed to fetch ${url}`);
        const compressed = await response.arrayBuffer();
        const decompressed = pako.inflate(compressed, { to: 'string' });
        const lines = decompressed.trim().split('\n');
        return lines.map(line => JSON.parse(line));
    } catch (error) {
        console.error(`Error fetching or processing data from ${url}:`, error);
        toast({
            variant: "destructive",
            title: "Error loading data",
            description: `Could not load data from ${url}. Check console for details.`,
        });
        return [];
    }
}

const DataContext = createContext<{data: DataState, loading: boolean} | undefined>(undefined);

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

            const distinctProducts = [...new Set(campaign.map((d: CampaignData) => d.product))].sort();
            const distinctProjects = [...new Set(campaign.map((d: CampaignData) => d.project))].sort();

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

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export interface Filters {
    dateRange?: DateRange;
    products?: string[];
    projects?: string[];
}

export function useFilteredData(filters: Filters) {
    const { data, loading } = useData();

    const filteredData = useMemo(() => {
        const { dateRange, products, projects } = filters;

        const filterItem = (item: { date: string, product: string, project: string }) => {
            const itemDate = new Date(item.date);
            if (!isValid(itemDate)) return false;

            const inDate = !dateRange || !dateRange.from || (itemDate >= dateRange.from && itemDate <= (dateRange.to || dateRange.from));
            const inProduct = !products || products.length === 0 || products.includes(item.product);
            const inProject = !projects || projects.length === 0 || projects.includes(item.project);
            
            return inDate && inProduct && inProject;
        };
        
        const campaign = filters.hasOwnProperty('dateRange') || filters.hasOwnProperty('products') || filters.hasOwnProperty('projects') ? data.campaign.filter(filterItem) : data.campaign;
        const activity = filters.hasOwnProperty('dateRange') || filters.hasOwnProperty('products') || filters.hasOwnProperty('projects') ? data.activity.filter(filterItem) : data.activity;
        
        const monthly = data.monthly.map(m => {
            const monthDate = new Date(m.month + '-01T00:00:00Z');
            return {
                ...m, 
                month: isValid(monthDate) ? format(monthDate, "MMMM") : "Invalid Month"
            }
        });

        return {
            campaign,
            activity,
            monthly,
        }

    }, [data, filters]);

    return { data: filteredData, loading };
}
