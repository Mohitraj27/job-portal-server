import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';
import { Frequency } from './job-alert.types';

const validateJobAlertSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    title: z.string().min(1, 'Title is required'),
    frequency: z.enum(Object.values(Frequency) as [string, ...string[]]).default('daily'),
})
export const validateJobAlertsSchema = validateSchema(validateJobAlertSchema, 'body');