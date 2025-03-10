
import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const LocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const validateLocation = validateSchema(LocationSchema,'body');
  