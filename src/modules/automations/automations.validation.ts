import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';
import { AutomationStatus, PricingType } from './automations.types';

const AutomationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  includedWith: z.enum([PricingType.PAID, PricingType.FREE, PricingType.COMING_SOON]),
  status: z.enum([AutomationStatus.ACTIVE, AutomationStatus.INACTIVE]),
});

export const validateAutomations = validateSchema(AutomationSchema, 'body');
