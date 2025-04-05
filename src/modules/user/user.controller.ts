import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';
import User from './user.model';
import { uploadProfilePictureToS3, uploadResumeToS3 } from '@utils/aws_helper';

export const userController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        role,
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
        role,
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
      const checkIsUserDeleted = await User.findOne({
        'personalDetails.email': email,
      }).select('isDeleted -_id');
      if (checkIsUserDeleted?.isDeleted === true) {
        return throwError(
          httpStatus.UNAUTHORIZED,
          USER_MESSAGES.USER_NOT_FOUND,
        );
      }
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
        null,
        USER_MESSAGES.PASSOWRD_RESET_LINK_SEND,
      );
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const user = await userService.resetPassword(token, newPassword);
      if (!user) {
        return throwError(
          httpStatus.TOKEN_EXPIRED,
          USER_MESSAGES.TOKEN_EXPIRED,
        );
      }

      return res.sendResponse(
        httpStatus.OK,
        null,
        USER_MESSAGES.PASSOWRD_RESET_SUCCESS,
      );
    } catch (error) {
      next(error);
    }
  },
  changePassword: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const user = await userService.changePassword(
        email,
        oldPassword,
        newPassword,
      );
      if (!user) {
        return throwError(
          httpStatus.UNAUTHORIZED,
          USER_MESSAGES.INVALID_PASSWORD,
        );
      }
      return res.sendResponse(
        httpStatus.OK,
        null,
        USER_MESSAGES.PASSOWRD_CHANGED_SUCCESS,
      );
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
        return throwError(
          httpStatus.UNAUTHORIZED,
          USER_MESSAGES.USER_NOT_FOUND_WITH_ID,
        );
      }
      const userId = req.body?.id;
      const {
        personalDetails: {
          firstName,
          lastName,
          email,
          phoneNumber: { number, countryCode },
          age,
          gender,
          bio,
          address,
          profilePicture,
          languages,
          dateOfBirth,
        },
        jobSeekerDetails,
        employerDetails,
        activityDetails,
      } = req.body;

      const updatedUser = await userService.updateUserProfile(userId, {
        personalDetails: {
          firstName,
          lastName,
          age,
          bio,
          address,
          phoneNumber: {
            number,
            countryCode,
          },
          languages,
          profilePicture,
          gender,
          email,
          dateOfBirth,
        },
        jobSeekerDetails,
        employerDetails,
        activityDetails,
      });

      res.sendResponse(
        httpStatus.OK,
        updatedUser,
        USER_MESSAGES.USER_PROFILE_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  },
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        userId,
        role,
        gender,
        provider,
        employmentType,
        workType,
        applicationStatus,
        accountStatus,
      } = req.query;
      if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
        }
        return res.sendResponse(
          httpStatus.OK,
          user,
          USER_MESSAGES.USER_PROFILE_FETCHED,
        );
      }
      const filters: any = {};

      if (role) filters.role = role;
      if (gender) filters['personalDetails.gender'] = gender;
      if (provider) filters['socialLogins.provider'] = provider;
      if (employmentType)
        filters['jobSeekerDetails.professionalDetails.employmentType'] =
          employmentType;
      if (workType)
        filters['jobSeekerDetails.jobPreferences.workType'] = workType;
      if (applicationStatus)
        filters['jobSeekerDetails.applicationsHistory.status'] =
          applicationStatus;
      if (accountStatus)
        filters['activityDetails.accountStatus'] = accountStatus;

      const users = await User.find(filters);
      res.sendResponse(
        httpStatus.OK,
        users,
        USER_MESSAGES.USER_PROFILE_FETCHED,
      );
    } catch (error) {
      next(error);
    }
  },
  uploadProfilePicture: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.query;
      const pictureFile = req.file as Express.Multer.File;
      if (!pictureFile) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.PROFILE_PICTURE_NOT_PROVIDED,
        );
      }
      const profilePictureUrl: any =
        await uploadProfilePictureToS3(pictureFile);
      if (!profilePictureUrl) {
        return throwError(
          httpStatus.INTERNAL_SERVER_ERROR,
          USER_MESSAGES.FAILED_TO_UPLOAD_PROFILE_PICTURE,
        );
      }
      const updatedUser = await userService.updateUserProfilePicture(
        userId,
        profilePictureUrl,
      );
      if (!updatedUser) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(
        httpStatus.OK,
        updatedUser,
        USER_MESSAGES.USER_PROFILE_PICTURE_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  },
  uploadResume: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.query;
      const isVerified = req.query.isVerified === 'true' ? true : req.query.isVerified === 'false' ? false : undefined;
      const isPublic = req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined;
        const resumeFile = req.file as Express.Multer.File;
      if (!resumeFile) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.RESUME_NOT_PROVIDED,
        );
      }
      const resumeUrl: any = await uploadResumeToS3(resumeFile);
      if (!resumeUrl) {
        return throwError(
          httpStatus.INTERNAL_SERVER_ERROR,
          USER_MESSAGES.FAILED_TO_UPLOAD_RESUME,
        );
      }
      const updatedUser = await userService.updateResume(userId, resumeUrl, isVerified, isPublic);
      if (!updatedUser) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(
        httpStatus.OK,
        updatedUser,
        USER_MESSAGES.USER_RESUME_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  },
  deleteUserProfile: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const deletedUser = await userService.deleteUserProfile(userId);
      if (!deletedUser) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, null, USER_MESSAGES.USER_PROFILE_DELETED);
    } catch (error) {
      next(error);
    }
  },
};
