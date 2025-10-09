'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { LeadFormData } from '@/types';
import { INDUSTRIES, LEAD_SOURCES } from '@/types';

interface LeadFormProps {
  onSuccess?: () => void;
}

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);

  const [formData, setFormData] = useState<LeadFormData>({
    company_name: '',
    contact_email: '',
    contact_name: '',
    industry: 'technology',
    company_size: 50,
    source: 'website',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAiScore(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create lead');
      }

      const lead = await response.json();
      setSuccess(true);
      setAiScore(lead.ai_score || null);

      // Reset form
      setFormData({
        company_name: '',
        contact_email: '',
        contact_name: '',
        industry: 'technology',
        company_size: 50,
        source: 'website',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'company_size' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
        <CardDescription>
          Create a new lead and get AI-powered scoring instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='company_name'>Company Name *</Label>
            <Input
              type='text'
              id='company_name'
              name='company_name'
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder='Acme Corporation'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact_email'>Contact Email *</Label>
            <Input
              type='email'
              id='contact_email'
              name='contact_email'
              required
              value={formData.contact_email}
              onChange={handleChange}
              placeholder='john@acme.com'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact_name'>Contact Name</Label>
            <Input
              type='text'
              id='contact_name'
              name='contact_name'
              value={formData.contact_name}
              onChange={handleChange}
              placeholder='John Doe'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='industry'>Industry *</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleSelectChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select industry' />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem
                    key={industry}
                    value={industry}
                  >
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='company_size'>Company Size (employees) *</Label>
            <Input
              type='number'
              id='company_size'
              name='company_size'
              required
              min='1'
              value={formData.company_size}
              onChange={handleChange}
              placeholder='50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='source'>Lead Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => handleSelectChange('source', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select source' />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((source) => (
                  <SelectItem
                    key={source}
                    value={source}
                  >
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded'>
              {error}
            </div>
          )}

          {success && (
            <div className='bg-status-success/10 border border-status-success/20 text-status-success px-4 py-3 rounded'>
              <p className='font-medium'>Lead created successfully!</p>
              {aiScore !== null && (
                <p className='text-sm mt-1'>
                  AI Score:{' '}
                  <span className='font-bold'>{aiScore.toFixed(1)}%</span>
                </p>
              )}
            </div>
          )}

          <Button
            type='submit'
            disabled={loading}
            className='w-full'
          >
            {loading ? 'Adding Lead...' : 'Add Lead'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
