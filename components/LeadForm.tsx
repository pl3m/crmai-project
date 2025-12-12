'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { leadFormSchema, type LeadFormData } from '@/lib/schemas';
import { INDUSTRIES, LEAD_SOURCES } from '@/types';

interface LeadFormProps {
  onSuccess?: () => void;
}

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      company_name: '',
      contact_email: '',
      contact_name: '',
      industry: 'technology',
      company_size: 50,
      source: 'website',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAiScore(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create lead');
      }

      const lead = await response.json();
      setSuccess(true);
      setAiScore(lead.ai_score || null);

      // Reset form
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead');
    } finally {
      setLoading(false);
    }
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
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='company_name'>Company Name *</Label>
            <Input
              type='text'
              id='company_name'
              {...register('company_name')}
              placeholder='Acme Corporation'
            />
            {errors.company_name && (
              <p className='text-sm text-destructive'>
                {errors.company_name.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact_email'>Contact Email *</Label>
            <Input
              type='email'
              id='contact_email'
              {...register('contact_email')}
              placeholder='john@acme.com'
            />
            {errors.contact_email && (
              <p className='text-sm text-destructive'>
                {errors.contact_email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact_name'>Contact Name</Label>
            <Input
              type='text'
              id='contact_name'
              {...register('contact_name')}
              placeholder='John Doe'
            />
            {errors.contact_name && (
              <p className='text-sm text-destructive'>
                {errors.contact_name.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='industry'>Industry *</Label>
            <Select
              value={watch('industry')}
              onValueChange={(value) => setValue('industry', value as any)}
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
            {errors.industry && (
              <p className='text-sm text-destructive'>
                {errors.industry.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='company_size'>Company Size (employees) *</Label>
            <Input
              type='number'
              id='company_size'
              {...register('company_size', { valueAsNumber: true })}
              min='1'
              placeholder='50'
            />
            {errors.company_size && (
              <p className='text-sm text-destructive'>
                {errors.company_size.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='source'>Lead Source</Label>
            <Select
              value={watch('source')}
              onValueChange={(value) => setValue('source', value as any)}
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
            {errors.source && (
              <p className='text-sm text-destructive'>
                {errors.source.message}
              </p>
            )}
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
