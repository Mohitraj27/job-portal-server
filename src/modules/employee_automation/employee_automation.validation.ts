import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const EmployeeAutomationSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  automationId: z.string().min(1, 'Automation ID is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  message: z.string().min(1, 'Message is required'),
});

export const validateEmployee_automation = validateSchema(EmployeeAutomationSchema, 'body');
