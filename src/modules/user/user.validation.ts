import { validateSchema } from '@middlewares/validation.middleware';
import { z } from 'zod';

const userSchema = z.object({
  phoneNumber: z.object({
    countryCode: z.string().optional(),
    number: z.string().nonempty('Phone number is required'),
  }),
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(30, 'First name must be less than 30 characters'),
  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .max(30, 'Last name must be less than 30 characters')
    .optional(),
  email: z.string().email('Invalid email format'),
  dateOfBirth: z.string().transform((val) => new Date(val)),
});

const loginSchema = z.object({
  email: z.string().email('Email is required and must be a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be no more than 15 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email is required').trim(),
});

const resetPasswordSchema = z.object({
  token: z.string().nonempty('Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be no more than 15 characters'),
});
const changePasswordSchema = z.object({
  email: z.string().email('Email is required').trim(),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(15, 'New password must be no more than 15 characters')
    .nonempty('New password is required'),
});
export const validateUserMiddleware = validateSchema(userSchema, 'body');
export const validateLoginMiddleware = validateSchema(loginSchema, 'body');
export const validateForgotPasswordMiddleware = validateSchema(
  forgotPasswordSchema,
  'body',
);
export const validateResetPasswordMiddleware = validateSchema(
  resetPasswordSchema,
  'body',
);
export const validateChangePasswordMiddleware = validateSchema(
  changePasswordSchema,
  'body',
);
