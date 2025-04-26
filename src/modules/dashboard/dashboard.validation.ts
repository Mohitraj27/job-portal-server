import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const validatedashboarddata = z.object({
    userId: z.string().min(1, 'User ID is required'),
})
export const validateDashboardSchema = validateSchema(validatedashboarddata, 'body');