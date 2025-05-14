import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

export enum Status {
  draft = 'draft',
  published = 'published',
  unpublished = 'unpublished',
  archived = 'archived',
}

const Content_managementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  contentType: z.string().min(1, 'Content type is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid URL format').min(1, 'Image URL is required'),
  tags: z.array(z.string()).min(1, 'Tags are required'),
  status: z.enum(Object.values(Status) as [string, ...string[]]).default(Status.draft),
});

export const validateContent_management = validateSchema(Content_managementSchema, 'body');
