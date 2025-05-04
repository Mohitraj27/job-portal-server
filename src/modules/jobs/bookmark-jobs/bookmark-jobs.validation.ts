import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const validateBookmarkJobSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    jobId: z.string().min(1, 'Job ID is required'),
})
const validateGetBookarkJobSchema = z.object({
    userId: z.string().min(1, 'User ID is required')
})
export const validateBookmarkJobMiddleware = validateSchema(validateBookmarkJobSchema, 'body');
export const validateGetBookarkJobMiddleware = validateSchema(validateGetBookarkJobSchema, 'query');