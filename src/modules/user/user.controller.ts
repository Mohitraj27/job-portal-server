import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
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
      const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phoneNumber,
        profilePicture,
        gender,
        socialLogins,
        jobSeekerDetails,
        employerDetails,
        activityDetails,
      } = req.body;
      const userData = {
        personalDetails: {
          firstName,
          lastName,
          email,
          password,
          dateOfBirth,
          phoneNumber,
          profilePicture,
          gender,
        },
        socialLogins,
        jobSeekerDetails,
        employerDetails,
        activityDetails,
      };
      const user = await userService.registerUser(userData);
      res.sendResponse(httpStatus.CREATED, user, USER_MESSAGES.USER_CREATED);
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
  forgetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await userService.forgetPassword(email);
      if (!user) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(
        httpStatus.OK,
        user,
        USER_MESSAGES.PASSOWRD_RESET_LINK_SEND,
      );
      res.sendResponse(httpStatus.OK, null, USER_MESSAGES.PASSOWRD_RESET_LINK_SEND);
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (  req: Request, res: Response, next: NextFunction, ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const user = await userService.resetPassword(token, newPassword);
      if(!user){
        return throwError(httpStatus.TOKEN_EXPIRED, USER_MESSAGES.TOKEN_EXPIRED);
      }
      
      return res.sendResponse(httpStatus.OK, null, USER_MESSAGES.PASSOWRD_RESET_SUCCESS);
    } catch (error) {
      next(error);
    }
  },
  changePassword: async (  req: Request, res: Response, next: NextFunction, ): Promise<void> => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const user = await userService.changePassword(email, oldPassword, newPassword);
      if(!user){
        return throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.INVALID_PASSWORD);
      }
      return res.sendResponse(httpStatus.OK, null, USER_MESSAGES.PASSOWRD_CHANGED_SUCCESS);
    } catch (error) {
      next(error);
    }
  },
  updateProfile: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.body || !req.body.id) {
        throwError(httpStatus.UNAUTHORIZED, 'User not authenticated');
        return;
      }
      const userId = req.body?.id; 
      const {
        firstName,
        lastName,
        phoneNumber,
        profilePicture,
        gender,
        socialLogins,
        jobSeekerDetails,
        employerDetails,
        activityDetails,
      } = req.body;
  
      const updatedUser = await userService.updateUserProfile(
        userId,
        {
          personalDetails: {
            firstName,
            lastName,
            phoneNumber,
            profilePicture,
            gender,
            email: ''
          },
          socialLogins,
          jobSeekerDetails,
          employerDetails,
          activityDetails,
        }
      );
  
      res.sendResponse(httpStatus.OK, updatedUser, USER_MESSAGES.USER_PROFILE_UPDATED);
    } catch (error) {
      next(error);
    }
  },
};
