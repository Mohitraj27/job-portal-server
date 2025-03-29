import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

export const EmployerSchema = z.object({
  name: z.string().min(1, 'Employer name is required'),
  description: z.string().min(1, 'Description is required').optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL format').optional(),
  establishedDate: z.string().optional(),
  teamSize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  industry: z.string().optional(),
  allowInSearch: z.boolean().optional(),
  about: z.string().optional(),
  benefits: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),

  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  socialMedia: z
    .object({
      facebook: z.string().url('Invalid URL format').nullable().optional(),
      twitter: z.string().url('Invalid URL format').nullable().optional(),
      linkedIn: z.string().url('Invalid URL format').nullable().optional(),
      instagram: z.string().url('Invalid URL format').nullable().optional(),
    })
    .optional(),
});

export const validateEmployer = validateSchema(EmployerSchema, 'body');
