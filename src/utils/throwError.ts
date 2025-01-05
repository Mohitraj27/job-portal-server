import { AppError } from "@middlewares/error.middleware";

export const throwError = (
    statusCode: number,
  message: string,
  isOperational: boolean = true,
) => {
  throw new AppError(statusCode, message, isOperational);
};
