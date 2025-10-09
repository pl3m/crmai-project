import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Helper function to calculate engagement score based on source
const calculateEngagementScore = (source?: string): number => {
  const sourceScores: Record<string, number> = {
    referral: 0.9,
    website: 0.7,
    event: 0.6,
    social: 0.5,
    cold: 0.3,
  };
  return sourceScores[source || 'website'] || 0.5;
};

// Helper function to get AI score from ML service
const getAIScore = async (
  companySize: number,
  industry: string,
  engagementScore: number
): Promise<{ score: number; probability: number; priority: string }> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/lead-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_size: companySize,
        industry,
        engagement_score: engagementScore,
      }),
    });

    if (!response.ok) {
      throw new Error('ML service unavailable');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling ML service:', error);
    // Return default values if ML service is unavailable
    return {
      score: 50,
      probability: 0.5,
      priority: 'medium',
    };
  }
};

// GET /api/leads - Get all leads
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const leadData = await request.json();

    // Validate required fields
    if (
      !leadData.company_name ||
      !leadData.contact_email ||
      !leadData.industry ||
      !leadData.company_size
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(leadData.source);

    // Get AI prediction
    const prediction = await getAIScore(
      leadData.company_size,
      leadData.industry,
      engagementScore
    );

    // Create lead in database
    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...leadData,
        ai_score: prediction.score,
        ai_priority: prediction.priority,
        status: 'new',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
