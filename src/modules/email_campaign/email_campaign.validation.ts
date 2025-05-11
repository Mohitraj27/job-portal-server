import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const Email_campaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  emailSubject: z.string().min(1, 'Email subject is required'),
  audience: z.string().min(1, 'Audience is required'),
  message: z.string().min(1, 'Message is required'),
});

export const validateEmail_campaign = validateSchema(
  Email_campaignSchema,
  'body',
);
