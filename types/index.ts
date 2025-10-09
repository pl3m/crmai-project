export interface Lead {
  id: string;
  company_name: string;
  contact_email: string;
  contact_name?: string;
  industry: string;
  company_size: number;
  source?: string;
  ai_score?: number;
  ai_priority?: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  company_name: string;
  contact_email: string;
  contact_name?: string;
  industry: string;
  company_size: number;
  source?: string;
}

export interface LeadScoreResponse {
  score: number;
  probability: number;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalyticsData {
  total_leads: number;
  high_priority_count: number;
  medium_priority_count: number;
  low_priority_count: number;
  conversion_rate: number;
  leads_by_industry: {
    industry: string;
    count: number;
  }[];
  leads_by_status: {
    status: string;
    count: number;
  }[];
}

export const INDUSTRIES = [
  'technology',
  'finance',
  'healthcare',
  'retail',
  'manufacturing',
] as const;

export const LEAD_SOURCES = [
  'referral',
  'website',
  'cold',
  'event',
  'social',
] as const;

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost',
] as const;
