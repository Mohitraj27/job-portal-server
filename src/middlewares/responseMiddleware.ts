import { sendResponse } from '@utils/sendResponse';
import { Request, Response, NextFunction } from 'express';

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Attach sendResponse function to res
  res.sendResponse = (
    statusCode = 200,
    data: any = null,
    message = 'Success',
    status = 'SUCCESS',
  ) => {
    sendResponse(res, statusCode, data, message, status);
  };

  next();
};
declare global {
  namespace Express {
    interface Response {
      sendResponse: (statusCode?: number, data?: any, message?: string,status?: string) => void;
    }
  }
}