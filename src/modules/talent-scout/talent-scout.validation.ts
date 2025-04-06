import { validateSchema } from '@middlewares/validation.middleware';
import { z } from 'zod';

const talentScountSchema = z.object({
    jobId: z.string().min(1, 'Job ID is required'),
})
 export const validateTalentScoutMiddleware = validateSchema(talentScountSchema,'body');
