
"use client"

import { useState, useEffect, useMemo } from 'react';
import pako from 'pako';
import { useToast } from './use-toast';
import { DateRange } from 'react-day-picker';
import { format, isValid } from 'date-fns';

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
}

interface Filters {
    dateRange: DateRange | undefined;
    products: string[];
    projects: string[];
}

const fetchAndDecompress = async (url: string, toast: any) => {
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Failed to fetch ${url}`);
        const compressed = await response.arrayBuffer();
        const decompressed = pako.inflate(compressed, { to: 'string' });
        // Handle line-delimited JSON (.jsonl or .ndjson)
        const lines = decompressed.trim().split('\n');
        return lines.map(line => JSON.parse(line));
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        toast({
            variant: "destructive",
            title: "Error loading data",
            description: `Could not load data from ${url}.`,
        });
        return [];
    }
}

export function useData(filters: Filters) {
    const { toast } = useToast();
    const [rawData, setRawData] = useState<DataState>({ campaign: [], activity: [], monthly: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [campaign, activity, monthly] = await Promise.all([
                fetchAndDecompress('/data/camp_user.json.gz', toast),
                fetchAndDecompress('/data/act.json.gz', toast),
                fetchAndDecompress('/data/monthly_metrics.json.gz', toast)
            ]);
            setRawData({ campaign, activity, monthly });
            setLoading(false);
        };
        loadData();
    }, [toast]);

    const distinctProducts = useMemo(() => [...new Set(rawData.campaign.map(d => d.product))], [rawData.campaign]);
    const distinctProjects = useMemo(() => [...new Set(rawData.campaign.map(d => d.project))], [rawData.campaign]);

    const filteredData = useMemo(() => {
        const { dateRange, products, projects } = filters;

        const filterItem = (item: { date: string, product: string, project: string }) => {
            const itemDate = new Date(item.date);
            const inDate = !dateRange || (dateRange.from && dateRange.to && itemDate >= dateRange.from && itemDate <= dateRange.to);
            const inProduct = products.length === 0 || products.includes(item.product);
            const inProject = projects.length === 0 || projects.includes(item.project);
            return inDate && inProduct && inProject;
        };
        
        const filteredCampaign = rawData.campaign.filter(filterItem);
        const filteredActivity = rawData.activity.filter(filterItem);

        const filteredMonthly = rawData.monthly.filter(item => {
            if (!dateRange?.from || !dateRange?.to) return true;
            const monthDate = new Date(item.month + '-01');
            if (!isValid(monthDate)) return false;
            const fromMonth = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1);
            const toMonth = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), 1);
            return monthDate >= fromMonth && monthDate <= toMonth;
        }).map(m => {
            const monthDate = new Date(m.month + '-01');
            return {
                ...m, 
                month: isValid(monthDate) ? format(monthDate, "MMMM") : "Invalid Month"
            }
        });


        return {
            campaign: filteredCampaign,
            activity: filteredActivity,
            monthly: filteredMonthly,
        }

    }, [rawData, filters]);


    return { data: filteredData, loading, error: null, distinctProducts, distinctProjects };
}
