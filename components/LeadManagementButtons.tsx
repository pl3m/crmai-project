'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';

interface LeadManagementButtonsProps {
  onRefresh?: () => void;
}

export default function LeadManagementButtons({
  onRefresh,
}: LeadManagementButtonsProps) {
  const [clearing, setClearing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const supabase = createClient();

  const resetToDemoData = async () => {
    if (
      !confirm(
        'Reset to demo data? This will replace all current leads with example data.'
      )
    ) {
      return;
    }

    setResetting(true);
    try {
      // Clear all existing leads
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) throw deleteError;

      // Insert demo data
      const demoLeads = [
        {
          company_name: 'TechCorp Inc',
          contact_email: 'ceo@techcorp.com',
          contact_name: 'Sarah Johnson',
          industry: 'technology',
          company_size: 1000,
          source: 'referral',
          ai_score: 89.7,
          ai_priority: 'high',
          status: 'new',
        },
        {
          company_name: 'Small Retail Shop',
          contact_email: 'owner@smallshop.com',
          contact_name: 'Mike Chen',
          industry: 'retail',
          company_size: 5,
          source: 'cold',
          ai_score: 12.3,
          ai_priority: 'low',
          status: 'new',
        },
        {
          company_name: 'Finance Solutions',
          contact_email: 'contact@finance.com',
          contact_name: 'Lisa Rodriguez',
          industry: 'finance',
          company_size: 500,
          source: 'website',
          ai_score: 67.8,
          ai_priority: 'medium',
          status: 'new',
        },
        {
          company_name: 'HealthTech Startup',
          contact_email: 'founder@healthtech.com',
          contact_name: 'Dr. Alex Kim',
          industry: 'healthcare',
          company_size: 50,
          source: 'event',
          ai_score: 45.2,
          ai_priority: 'medium',
          status: 'new',
        },
        {
          company_name: 'Manufacturing Giant',
          contact_email: 'procurement@mfg.com',
          contact_name: 'Robert Wilson',
          industry: 'manufacturing',
          company_size: 5000,
          source: 'referral',
          ai_score: 78.9,
          ai_priority: 'high',
          status: 'new',
        },
      ];

      const { error: insertError } = await supabase
        .from('leads')
        .insert(demoLeads);

      if (insertError) throw insertError;

      // Refresh data
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Failed to reset to demo data'
      );
    } finally {
      setResetting(false);
    }
  };

  const clearAllLeads = async () => {
    if (
      !confirm(
        'Are you sure you want to delete all leads? This action cannot be undone.'
      )
    ) {
      return;
    }

    setClearing(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      // Refresh data
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to clear leads');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className='flex gap-3'>
      <Button
        variant='outline'
        size='default'
        onClick={resetToDemoData}
        disabled={resetting}
      >
        {resetting ? 'Resetting...' : 'Reset to Demo Data'}
      </Button>
      <Button
        variant='destructive'
        size='default'
        onClick={clearAllLeads}
        disabled={clearing}
      >
        {clearing ? 'Clearing...' : 'Clear All Leads'}
      </Button>
    </div>
  );
}
