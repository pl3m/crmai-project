import { z } from 'zod';
import { INDUSTRIES, LEAD_SOURCES } from '@/types';

// Zod schema for lead form validation
export const leadFormSchema = z.object({
  company_name: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),

  contact_email: z
    .string()
    .min(1, 'Contact email is required')
    .email('Please enter a valid email address'),

  contact_name: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(50, 'Contact name must be less than 50 characters')
    .optional()
    .or(z.literal('')),

  industry: z.enum(INDUSTRIES, {
    errorMap: () => ({ message: 'Please select a valid industry' }),
  }),

  company_size: z
    .number({
      required_error: 'Company size is required',
      invalid_type_error: 'Company size must be a number',
    })
    .int('Company size must be a whole number')
    .min(1, 'Company size must be at least 1 employee')
    .max(100000, 'Company size must be less than 100,000 employees'),

  source: z
    .enum(LEAD_SOURCES, {
      errorMap: () => ({ message: 'Please select a valid lead source' }),
    })
    .optional(),
});

// Infer the TypeScript type from the schema
export type LeadFormData = z.infer<typeof leadFormSchema>;

// Schema for API request validation (server-side)
export const createLeadRequestSchema = leadFormSchema;
