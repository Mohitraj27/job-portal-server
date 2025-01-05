import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { sendResponse } from '@utils/sendResponse';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';

export const userController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { firstName, email, password, lastName, dateOfBirth } = req.body;
      const user = await userService.registerUser(
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
      );
      res.sendResponse(
        httpStatus.CREATED,
        user,
        USER_MESSAGES.USER_CREATED,
      );
    } catch (error) {
      next(error);
    }
  },

  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await userService.loginUser(email, password);
      if (!user) {
        return throwError(
          httpStatus.UNAUTHORIZED,
          USER_MESSAGES.INVALID_CREDENTIALS,
        );
      }

      res.sendResponse(httpStatus.OK, user, USER_MESSAGES.USER_LOGGED_IN);
    } catch (error) {
      next(error);
    }
  },
  forgetPassword: async (  req: Request, res: Response, next: NextFunction, ): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await userService.forgetPassword(email);
      if(!user){
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, user, USER_MESSAGES.PASSOWRD_RESET_LINK_SEND);
    } catch (error) {
      next(error);
    }
  },
};
