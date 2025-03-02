
import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const StateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const validateState = validateSchema(StateSchema,'body');
  