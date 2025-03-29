import { z } from 'zod';
import {
  Currency,
  JobEmploymentType,
  JobExperienceLevel,
  JobPriority,
  JobStatus,
} from './jobs.types';
import { validateSchema } from '@middlewares/validation.middleware';
const companySchema = z.object({
  name: z.string(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
}).optional();

const coordinatesSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const locationSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'), 
  zipCode: z.string().optional(),
  streetAddress: z.string().optional(),
  coordinates: coordinatesSchema.optional(),
  remoteRestriction: z.string().optional(),
});
const ExperienceSchema = z.object({
  level: z.enum(Object.values(JobExperienceLevel) as [string, ...string[]]),
  years: z.object({
    min: z.number().min(0),
    max: z.number().min(0).max(50),
  }),
});

const SalarySchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  currency: z
    .enum(Object.values(Currency) as [string, ...string[]])
    .default('USD'),
});

const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  company: companySchema.optional(),
  category: z.string(),
  location: locationSchema,
  employmentType: z.enum(
    Object.values(JobEmploymentType) as [string, ...string[]],
  ),
  industry: z.string(),
  skills: z.array(z.string()).min(1),
  experience: ExperienceSchema,
  education: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  salary: SalarySchema,
  numberOfOpenings: z.number().min(1).default(1),
  postedAt: z.date().default(() => new Date()),
  validTill: z.string(),
  remote: z.boolean().default(false),
  benefits: z.array(z.string()).default([]),
  applicationLink: z.string().url(),
  createdBy: z.object({
    userId: z.string(),
  }),
  status: z
    .enum(Object.values(JobStatus) as [string, ...string[]])
    .default(JobStatus.ACTIVE),
  priority: z
    .enum(Object.values(JobPriority) as [string, ...string[]])
    .default(JobPriority.NORMAL),
  tags: z.array(z.string()).default([]),
  views: z.number().default(0),
  applicationsCount: z.number().default(0),
  savedCount: z.number().default(0),
});

const deleteJobSchema = z.object({
  id: z.string(),
});

const incrementViewsSchema = z.object({
  id: z.string(),
});

const findJobsByCategorySchema = z.object({
  id: z.string(),
});

const getAllJobsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const getSingleJobSchema = z.object({
  id: z.string(),
});

const updateJobSchema = z.object({
  updateData: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    company: companySchema.optional(),
    category: z.string().optional(),
    location: locationSchema.optional(),
    employmentType: z
      .enum(Object.values(JobEmploymentType) as [string, ...string[]])
      .optional(),
    industry: z.string().optional(),
    skills: z.array(z.string()).min(1).optional(),
    experience: ExperienceSchema.optional(),
    education: z.array(z.string()).default([]).optional(),
    languages: z.array(z.string()).default([]).optional(),
    salary: SalarySchema.optional(),
    numberOfOpenings: z.number().min(1).default(1).optional(),
    postedAt: z
      .date()
      .default(() => new Date())
      .optional(),
    validTill: z.date().optional(),
    remote: z.boolean().default(false).optional(),
    benefits: z.array(z.string()).default([]).optional(),
    applicationLink: z.string().url().optional(),
    status: z
      .enum(Object.values(JobStatus) as [string, ...string[]])
      .default(JobStatus.ACTIVE)
      .optional(),
    priority: z
      .enum(Object.values(JobPriority) as [string, ...string[]])
      .default(JobPriority.NORMAL)
      .optional(),
    tags: z.array(z.string()).default([]).optional(),
    views: z.number().default(0).optional(),
    applicationsCount: z.number().default(0).optional(),
    savedCount: z.number().default(0).optional(),
  }),
});

export const validateJobMiddleware = validateSchema(createJobSchema, 'body');
export const validateDeleteJobMiddleware = validateSchema(
  deleteJobSchema,
  'params',
);
export const validateIncrementViewsMiddleware = validateSchema(
  incrementViewsSchema,
  'query',
);
export const validateFindJobsByCategoryMiddleware = validateSchema(
  findJobsByCategorySchema,
  'query',
);
export const validateGetAllJobsMiddleware = validateSchema(
  getAllJobsSchema,
  'query',
);
export const validateGetSingleJobMiddleware = validateSchema(
  getSingleJobSchema,
  'query',
);
export const validateUpdateJobMiddleware = validateSchema(
  updateJobSchema,
  'body',
);
