import { z } from 'zod';
import { UserDTO } from './user.types';
import { Request, Response, NextFunction } from 'express';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';

export const validateUser = (user: UserDTO) => {
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

  return userSchema.safeParse(user);
};

export const validateLogin = (loginData: UserDTO) => {
  const loginSchema = z.object({
    email: z.string().email('Email is required and must be a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(15, 'Password must be no more than 15 characters'),
  });

  return loginSchema.safeParse(loginData);
};

export const validateUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validation = validateUser(req.body);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((err) => err.message)
      .join(', ');

    throwError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages}`);
  }

  next();
};

export const validateLoginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validation = validateLogin(req.body);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((err) => err.message)
      .join(', ');

    throwError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages}`);
  }

  next();
};
