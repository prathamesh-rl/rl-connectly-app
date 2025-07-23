"use client"

import { useMemo, useContext } from 'react';
import pako from 'pako';
import { DateRange } from 'react-day-picker';
import { format, isValid, parseISO } from 'date-fns';
import { DataContext } from '@/context/data-context';

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

export interface RawData {
    campaign: CampaignData[];
    activity: ActivityData[];
    monthly: MonthlyData[];
}

export interface DataState extends RawData {
    distinctProducts: string[];
    distinctProjects: string[];
}

export const fetchAndDecompress = async (url: string, toast: any): Promise<any[]> => {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const compressed = await response.arrayBuffer();
        const decompressed = pako.inflate(compressed, { to: 'string' });
        const lines = decompressed.trim().split('\n');
        return lines.map(line => JSON.parse(line));
    } catch (error) {
        console.error(`Error fetching or processing data from ${url}:`, error);
        toast({
            variant: "destructive",
            title: `Error loading data from ${url}`,
            description: "Please check the console for more details.",
        });
        return [];
    }
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
            if (!item || !item.date) return false;
            
            const itemDate = parseISO(item.date);
            if (!isValid(itemDate)) return false;

            const inDate = !dateRange || !dateRange.from || (itemDate >= dateRange.from && itemDate <= (dateRange.to || new Date()));
            const inProduct = !products || products.length === 0 || products.includes(item.product);
            const inProject = !projects || projects.length === 0 || projects.includes(item.project);
            
            return inDate && inProduct && inProject;
        };
        
        const campaign = data.campaign.filter(filterItem);
        const activity = data.activity.filter(filterItem);
        
        const monthly = data.monthly.map(m => {
            const monthDate = parseISO(`${m.month}-01T00:00:00Z`);
            return {
                ...m, 
                month: isValid(monthDate) ? format(monthDate, "MMMM") : "Invalid"
            }
        }).filter(m => m.month !== "Invalid");

        return {
            campaign,
            activity,
            monthly,
        }

    }, [data, filters]);

    return { data: filteredData, loading };
}
