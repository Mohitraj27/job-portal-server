
import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const Admin_dashboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const validateAdmin_dashboard = validateSchema(Admin_dashboardSchema,'body');
  