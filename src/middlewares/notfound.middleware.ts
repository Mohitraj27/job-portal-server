import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  
  res.sendResponse(404, null, 'ROUTE_NOT_FOUND', 'ERROR');
};
