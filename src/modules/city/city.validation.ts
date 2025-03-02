
import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const CitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const validateCity = validateSchema(CitySchema,'body');
  