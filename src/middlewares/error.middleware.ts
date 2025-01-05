import { Request, Response, NextFunction } from 'express';


interface CustomError extends Error {
  status?: number;
  isOperational?: boolean;
  requestId?: string;
  functionName?: string; 
}

export class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(status: number, message: string, isOperational = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = err.status || 500;
  const isOperational = err.isOperational || false;
  const environment = process.env.NODE_ENV || 'development';
  const requestId = req.headers['x-request-id'] || 'N/A';

  let functionName = 'Unknown';
  if (err.stack) {
    const stackLines = err.stack.split('\n');
    const match = stackLines[1]?.match(/at\s([^(]+)\s/); 
    if (match && match[1]) {
      functionName = match[1]; 
    }
  }

  console.error({
    message: err.message,
    status,
    stack: environment === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    requestId,
    functionName,
  });

  const errorResponse = {
    status: 'error',
    message: isOperational ? err.message : 'Internal Server Error',
    requestId,
    functionName,
    timestamp: new Date().toISOString(), 
    ...(environment === 'development' && { stack: err.stack }),
  };

  res.status(status).json(errorResponse);
};
