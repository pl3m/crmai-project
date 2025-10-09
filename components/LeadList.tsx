'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Lead } from '@/types';

export default function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchLeads();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadgeColor = (score?: number) => {
    if (!score) return null;

    // Scale from slate grey (0) → button blue (100)
    // Interpolate between grey and blue based on score
    const greyHue = 210; // Same hue as blue for smooth transition
    const blueHue = 221.2; // Our button blue hue
    const greySaturation = 5; // Very low saturation for grey
    const blueSaturation = 83.2; // Our button blue saturation
    const greyLightness = 90; // Very light grey
    const blueLightness = 53.3; // Our button blue lightness

    // Interpolate between grey and blue
    const hue = greyHue + (score / 100) * (blueHue - greyHue);
    const saturation =
      greySaturation + (score / 100) * (blueSaturation - greySaturation);
    const lightness =
      greyLightness - (score / 100) * (greyLightness - blueLightness);

    return {
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      color: score > 40 ? 'white' : 'hsl(210, 20%, 30%)', // Dark text on light, white on blue
      borderColor: 'transparent',
    };
  };

  const getPriorityBadgeVariant = (
    priority?: string
  ): 'urgent' | 'moderate' | 'low' | 'secondary' => {
    switch (priority) {
      case 'high':
        return 'urgent'; // red
      case 'medium':
        return 'moderate'; // orange
      case 'low':
        return 'low'; // yellow
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded'>
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Leads</CardTitle>
        <CardDescription>
          Manage and track your sales leads with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className='text-muted-foreground text-center py-8'>
            No leads yet. Add your first lead to get started!
          </p>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className='font-medium'>{lead.company_name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {lead.company_size} employees
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{lead.contact_name || 'N/A'}</div>
                      <div className='text-sm text-muted-foreground'>
                        {lead.contact_email}
                      </div>
                    </TableCell>
                    <TableCell className='capitalize'>
                      {lead.industry}
                    </TableCell>
                    <TableCell>
                      {lead.ai_score ? (
                        <Badge
                          style={getScoreBadgeColor(lead.ai_score) || undefined}
                        >
                          {lead.ai_score.toFixed(1)}%
                        </Badge>
                      ) : (
                        <span className='text-sm text-muted-foreground'>
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.ai_priority ? (
                        <Badge
                          variant={
                            getPriorityBadgeVariant(lead.ai_priority) as any
                          }
                          className='capitalize'
                        >
                          {lead.ai_priority}
                        </Badge>
                      ) : (
                        <span className='text-sm text-muted-foreground'>
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className='capitalize'
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
