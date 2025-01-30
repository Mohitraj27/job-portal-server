import httpStatus from "@utils/httpStatus";
import { throwError } from "@utils/throwError";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";


export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return throwError(httpStatus.BAD_REQUEST, 'Invalid ObjectId');
  }

  next();
};

