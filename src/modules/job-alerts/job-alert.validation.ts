import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const validateJobAlertSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    title: z.string().min(1, 'Title is required'),
})
export const validateJobAlertsSchema = validateSchema(validateJobAlertSchema, 'body');