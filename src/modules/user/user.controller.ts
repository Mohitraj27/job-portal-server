import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { sendResponse } from '@utils/sendResponse';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { UserErrorMessages } from './user.enum';

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
        UserErrorMessages.USER_CREATED,
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
          UserErrorMessages.INVALID_CREDENTIALS,
        );
      }

      res.sendResponse(httpStatus.OK, user, UserErrorMessages.USER_LOGGED_IN);
    } catch (error) {
      next(error);
    }
  },
};
