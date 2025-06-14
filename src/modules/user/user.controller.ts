import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';
import User from './user.model';
import { uploadProfilePictureToS3, uploadResumeToS3,uploadResumeDocumentationToS3 } from '@utils/aws_helper';

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
      const body = req.body;

      if (!body || !body.id) {
        return throwError(
          httpStatus.UNAUTHORIZED,
          USER_MESSAGES.USER_NOT_FOUND_WITH_ID,
        );
      }

      const userId = body.id;

      // Safely extract personalDetails
      const personalDetails = body.personalDetails || {};
      const phoneNumber = personalDetails.phoneNumber || {};

      const userPayload: any = {};

      // Only include fields if they exist (optional step for cleaner payload)
      if (body.personalDetails) {
        const personalDetails = body.personalDetails;

        userPayload.personalDetails = {
          firstName: personalDetails.firstName,
          lastName: personalDetails.lastName,
          email: personalDetails.email,
          phoneNumber: {
            number: phoneNumber.number,
            countryCode: phoneNumber.countryCode,
          },
          alternateMobileNo: personalDetails.alternateMobileNo,
          dateOfBirth: personalDetails.dateOfBirth,
          gender: personalDetails.gender,
          maritalStatus: personalDetails.maritalStatus,
          physicalDisability: personalDetails.physicalDisability,
          visaStatus: personalDetails.visaStatus,
          nationality: personalDetails.nationality,
          profilePicture: personalDetails.profilePicture,
          address: personalDetails.address || {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
        };
      }
      

      if (body.jobSeekerDetails) {
        userPayload.jobSeekerDetails = body.jobSeekerDetails;
      }

      if (body.employerDetails) {
        userPayload.employerDetails = body.employerDetails;
      }

      if (body.activityDetails) {
        userPayload.activityDetails = body.activityDetails;
      }

      const updatedUser = await userService.updateUserProfile(
        userId,
        userPayload,
      );

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
      const isVerified =
        req.query.isVerified === 'true'
          ? true
          : req.query.isVerified === 'false'
            ? false
            : undefined;
      const isPublic =
        req.query.isPublic === 'true'
          ? true
          : req.query.isPublic === 'false'
            ? false
            : undefined;
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
      const updatedUser = await userService.updateResume(
        userId,
        resumeUrl,
        isVerified,
        isPublic,
      );
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
  async getUserViews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.query;
      if (!userId) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.USER_ID_REQUIRED,
        );
      }
      const userViews = await userService.getUserViews(userId as string);
      if (!userViews) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
      res.sendResponse(
        httpStatus.OK,
        userViews,
        USER_MESSAGES.USER_VIEWS_FETCHED,
      );
    } catch (error) {
      next(error);
    }
  },
  async incrementUserViews(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.USER_ID_REQUIRED,
        );
      }
      const updatedUser = await userService.incrementUserViews(
        userId as string,
      );

      res.sendResponse(
        httpStatus.OK,
        updatedUser,
        USER_MESSAGES.USER_VIEWS_INCREMENTED,
      );
    } catch (error) {
      next(error);
    }
  },
  uploadResumeDocumentation: async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
    try {
      const { userId } = req.query;
      const { typeofFile } = req.body;
      const documentFile = req.file as Express.Multer.File;
  
      if (!documentFile) {return throwError(httpStatus.BAD_REQUEST,USER_MESSAGES.DOCUMENT_FILE_NOT_PROVIDED);
      }
  
      if (!typeofFile) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.FILE_TYPE_NOT_PROVIDED,
        );
      }
  
      const allowedFileTypes = ['uploadResume', 'uploadPhoto', 'uploadCertificates'];
      if (!allowedFileTypes.includes(typeofFile)) {
        return throwError(
          httpStatus.BAD_REQUEST,
          USER_MESSAGES.INVALID_FILE_TYPE,
        );
      }
  
      const documentUrl: any = await uploadResumeDocumentationToS3(
        documentFile,
        typeofFile
      );
  
      if (!documentUrl) {
        return throwError(httpStatus.INTERNAL_SERVER_ERROR, USER_MESSAGES.FAILED_TO_UPLOAD_DOCUMENT);
      }
  
      const updatedUser = await userService.updateUserResumeDocumentation(
        userId,
        typeofFile,
        documentUrl,
      );
  
      if (!updatedUser) {
        return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
      }
  
      res.sendResponse(
        httpStatus.OK,
        updatedUser,
        USER_MESSAGES.USER_DOCUMENT_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  },
};
