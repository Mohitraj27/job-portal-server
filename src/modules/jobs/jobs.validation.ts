import { z } from "zod";
import { Currency, JobEmploymentType, JobExperienceLevel, JobPriority, JobStatus } from "./jobs.types";
import { validateSchema } from "@middlewares/validation.middleware";

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

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  company: z.string(),
  category: z.string(),
  location: z.string(),
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
  validTill: z.date(),
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
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const deleteJobSchema = z.object({
  id: z.string(),
});

const incrementViewsSchema = z.object({
  jobId: z.string(),
});

const findJobsByCategorySchema = z.object({
  categoryId: z.string(),
});

const getAllJobsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const getSingleJobSchema = z.object({
  jobId: z.string(),
});

const updateJobSchema = z.object({
  jobId: z.string(),
  updateData: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    company: z.string(),
    category: z.string(),
    location: z.string(),
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
    validTill: z.date(),
    remote: z.boolean().default(false),
    benefits: z.array(z.string()).default([]),
    applicationLink: z.string().url(),
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
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  }),
});

export const validateJobMiddleware = validateSchema(jobSchema, 'body');
export const validateDeleteJobMiddleware = validateSchema(deleteJobSchema, 'params');
export const validateIncrementViewsMiddleware = validateSchema(incrementViewsSchema, 'query');
export const validateFindJobsByCategoryMiddleware = validateSchema(findJobsByCategorySchema, 'query');
export const validateGetAllJobsMiddleware = validateSchema(getAllJobsSchema, 'query');
export const validateGetSingleJobMiddleware = validateSchema(getSingleJobSchema, 'query');
export const validateUpdateJobMiddleware = validateSchema(updateJobSchema, 'body');


