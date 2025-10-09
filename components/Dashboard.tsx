'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeadManagementButtons from '@/components/LeadManagementButtons';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Lead } from '@/types';

interface AnalyticsData {
  totalLeads: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  averageScore: number;
  industryData: { industry: string; count: number }[];
  industryPieData: { industry: string; count: number }[];
}

const chartConfig = {
  technology: { label: 'Technology', color: '#3b82f6' },
  finance: { label: 'Finance', color: '#10b981' },
  healthcare: { label: 'Healthcare', color: '#22c55e' },
  retail: { label: 'Retail', color: '#f59e0b' },
  manufacturing: { label: 'Manufacturing', color: '#ef4444' },
} satisfies ChartConfig;

const pieChartConfig = {
  technology: { label: 'Technology', color: '#3b82f6' },
  finance: { label: 'Finance', color: '#10b981' },
  healthcare: { label: 'Healthcare', color: '#22c55e' },
  retail: { label: 'Retail', color: '#f59e0b' },
  manufacturing: { label: 'Manufacturing', color: '#ef4444' },
} satisfies ChartConfig;

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data: leads, error: fetchError } = await supabase
        .from('leads')
        .select('*');

      if (fetchError) throw fetchError;

      if (leads) {
        const analytics = calculateAnalytics(leads);
        setAnalytics(analytics);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analytics'
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnalytics, supabase]);

  const calculateAnalytics = (leads: Lead[]): AnalyticsData => {
    const totalLeads = leads.length;
    const highPriority = leads.filter((l) => l.ai_priority === 'high').length;
    const mediumPriority = leads.filter(
      (l) => l.ai_priority === 'medium'
    ).length;
    const lowPriority = leads.filter((l) => l.ai_priority === 'low').length;

    const scoresSum = leads.reduce(
      (sum, lead) => sum + (lead.ai_score || 0),
      0
    );
    const averageScore = totalLeads > 0 ? scoresSum / totalLeads : 0;

    // Group by industry
    const industryMap = new Map<string, number>();
    leads.forEach((lead) => {
      const count = industryMap.get(lead.industry) || 0;
      industryMap.set(lead.industry, count + 1);
    });
    const industryData = Array.from(industryMap.entries()).map(
      ([industry, count]) => ({
        industry: industry.charAt(0).toUpperCase() + industry.slice(1),
        count,
      })
    );

    // Create industry pie chart data (same as bar chart but for pie)
    const industryPieData = Array.from(industryMap.entries()).map(
      ([industry, count]) => ({
        industry: industry.charAt(0).toUpperCase() + industry.slice(1),
        count,
      })
    );

    return {
      totalLeads,
      highPriority,
      mediumPriority,
      lowPriority,
      averageScore,
      industryData,
      industryPieData,
    };
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Analytics Dashboard
        </h1>
        <LeadManagementButtons onRefresh={fetchAnalytics} />
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='pb-3'>
            <CardDescription>Total Leads</CardDescription>
            <CardTitle className='text-3xl'>{analytics.totalLeads}</CardTitle>
          </CardHeader>
        </Card>

        <Card className='border-t-4 border-t-red-500'>
          <CardHeader className='pb-3'>
            <CardDescription>High Priority</CardDescription>
            <CardTitle className='text-3xl text-red-600'>
              {analytics.highPriority}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className='border-t-4 border-t-yellow-500'>
          <CardHeader className='pb-3'>
            <CardDescription>Medium Priority</CardDescription>
            <CardTitle className='text-3xl text-yellow-600'>
              {analytics.mediumPriority}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className='border-t-4 border-t-blue-500'>
          <CardHeader className='pb-3'>
            <CardDescription>Average Score</CardDescription>
            <CardTitle className='text-3xl text-blue-600'>
              {analytics.averageScore.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Industry</CardTitle>
            <CardDescription>
              Distribution of leads across industries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.industryData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className='h-[300px]'
              >
                <BarChart data={analytics.industryData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    className='stroke-muted'
                  />
                  <XAxis
                    dataKey='industry'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className='text-xs'
                    tickFormatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className='text-xs'
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar
                    dataKey='count'
                    radius={[8, 8, 0, 0]}
                  >
                    {analytics.industryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          chartConfig[
                            entry.industry.toLowerCase() as keyof typeof chartConfig
                          ]?.color || '#3b82f6'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className='text-muted-foreground text-center py-8'>
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Industry</CardTitle>
            <CardDescription>
              Distribution across different industry sectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.industryPieData.length > 0 ? (
              <ChartContainer
                config={pieChartConfig}
                className='h-[300px]'
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={analytics.industryPieData}
                    dataKey='count'
                    nameKey='industry'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                    label={({ industry, percent }: any) =>
                      `${industry}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {analytics.industryPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          pieChartConfig[
                            entry.industry.toLowerCase() as keyof typeof pieChartConfig
                          ]?.color || '#3b82f6'
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className='text-muted-foreground text-center py-8'>
                No data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
