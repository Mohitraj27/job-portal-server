import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';
import { ApplicationStatus } from './applied-candidates.types';



const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  candidateId: z.string().min(1, 'Candidate ID is required'),

  // coverLetter: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(Object.values(ApplicationStatus) as [string, ...string[]])
});

const shortlistCandidateSchema = z.object({
  isShortlisted: z.boolean()
});

const addNotesSchema = z.object({
  notes: z.string().min(1, 'Notes cannot be empty')
});

const getApplicationsQuerySchema = z.object({
  status: z.enum(Object.values(ApplicationStatus) as [string, ...string[]]).optional(),
  isShortlisted: z.boolean().optional(),
  appliedAfter: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }).optional(),
  appliedBefore: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }).optional(),
  skills: z.array(z.string()).optional(),
  experienceMin: z.number().min(0).optional(),
  experienceMax: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('appliedDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const validateCreateApplicationMiddleware = validateSchema(createApplicationSchema, 'body');
export const validateUpdateStatusMiddleware = validateSchema(updateStatusSchema, 'body');
export const validateShortlistCandidateMiddleware = validateSchema(shortlistCandidateSchema, 'body');
export const validateAddNotesMiddleware = validateSchema(addNotesSchema, 'body');
export const validateGetApplicationsQueryMiddleware = validateSchema(getApplicationsQuerySchema, 'query');