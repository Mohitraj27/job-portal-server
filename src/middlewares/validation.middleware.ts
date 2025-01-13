import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';

export const validateSchema = (
  schema: ZodSchema,
  key: 'body' | 'query' | 'params',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req[key]);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => {
          const fieldPath = err.path.join('.');
          return `${fieldPath} is ${err.message}`;
        })
        .join(', ');

      throwError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages}`);
    }

    next();
  };
};
