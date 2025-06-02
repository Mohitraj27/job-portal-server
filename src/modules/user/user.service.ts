import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserView } from './user.model';
import { config } from '@config/env';
import { AccountStatus, IUser } from './user.types';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';
import crypto from 'crypto';
import { sendEmail } from '@utils/emailService';
import passwordResetTemplate from '@email_template/forgetPassword';
import mongoose from 'mongoose';
import { Role } from '../user/user.types';
export const userService = {
  registerUser: async (userData: Partial<IUser>): Promise<IUser> => {
    const existingUser = await User.findOne({
      'personalDetails.email': userData.personalDetails?.email,
    });
    if (existingUser) {
      throwError(httpStatus.BAD_REQUEST, USER_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const newUser = new User({
      role: userData.role,
      personalDetails: {
        firstName: userData.personalDetails?.firstName,
        lastName: userData.personalDetails?.lastName || '',
        dateOfBirth: userData.personalDetails?.dateOfBirth,
        password: await bcrypt.hash(userData.personalDetails?.password!, 10),
        email: userData.personalDetails?.email,
        phoneNumber: userData.personalDetails?.phoneNumber,
        profilePicture: userData.personalDetails?.profilePicture,
        gender: userData.personalDetails?.gender,
      },
      socialLogins: userData.socialLogins || [],
      jobSeekerDetails: userData.jobSeekerDetails || {},
      employerDetails: userData.employerDetails || {},
      activityDetails: {
        accountStatus:
          userData.activityDetails?.accountStatus || AccountStatus.ACTIVE,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newUser.save();
  },
  loginUser: async (
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string } | undefined> => {
    const user = await User.findOne({ 'personalDetails.email': email }).select(
      '+personalDetails.password',
    );
    if (!user) {
      throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.INVALID_CREDENTIALS);
    }
    if (
      user &&
      !(await bcrypt.compare(password, user.personalDetails.password!))
    ) {
      throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.INVALID_CREDENTIALS);
    }
    if (
      user &&
      (await bcrypt.compare(password, user.personalDetails.password!))
    ) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' },
      );
      return { user, token };
    } else {
      throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.USER_ALREADY_EXISTS);
      return undefined; // Ensure all code paths return a value
    }
  },
  forgetPassword: async (email: string): Promise<IUser> => {
    const user = await User.findOne({ 'personalDetails.email': email });
    if (!user) {
      return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.activityDetails.passwordResetToken = resetToken;
    user.activityDetails.passwordResetExpires = Date.now() + 600000;

    await user.save();
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    const emailContent = passwordResetTemplate(user, resetLink);
    await sendEmail(
      user.personalDetails.email,
      'Forget Password Request',
      emailContent,
    );
    return user;
  },

  resetPassword: async (token: string, newPassword: string): Promise<IUser> => {
    const user = await User.findOne({
      'activityDetails.passwordResetToken': token,
      'activityDetails.passwordResetExpires': { $gt: Date.now() },
    });
    if (!user) {
      return throwError(httpStatus.NOT_FOUND, USER_MESSAGES.TOKEN_EXPIRED);
    }
    user.personalDetails.password = await bcrypt.hash(newPassword, 10);
    user.activityDetails.passwordResetToken = undefined;
    user.activityDetails.passwordResetExpires = undefined;
    await user.save();

    return user;
  },
  changePassword: async (
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<IUser> => {
    const user = await User.findOne({ 'personalDetails.email': email });
    if (!user) {
      return throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.USER_NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.personalDetails.password!,
    );
    if (!isMatch) {
      return throwError(
        httpStatus.UNAUTHORIZED,
        USER_MESSAGES.INVALID_PASSWORD,
      );
    }
    user.personalDetails.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
  },
  updateUserProfile: async (
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> => {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throwError(httpStatus.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    if (updateData.personalDetails?.password) {
      updateData.personalDetails.password = await bcrypt.hash(
        updateData.personalDetails.password,
        10,
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          personalDetails:
            updateData?.personalDetails || existingUser?.personalDetails,
            jobSeekerDetails: {
              ...existingUser?.jobSeekerDetails,
              ...updateData?.jobSeekerDetails,
              education: updateData?.jobSeekerDetails?.education?.map(({ _id, ...edu }) => ({
                ...edu,
                // optionally convert fields like yearOfPassing, startDate, endDate
                yearOfGraduation: edu.yearOfGraduation ? String(edu.yearOfGraduation) : undefined,
              })) || existingUser?.jobSeekerDetails?.education,
            },
          employerDetails:
            updateData?.employerDetails || existingUser?.employerDetails,
          activityDetails:
            updateData?.activityDetails || existingUser?.activityDetails,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      throwError(
        httpStatus.INTERNAL_SERVER_ERROR,
        USER_MESSAGES.USER_PROFILE_UPDATE_FAILED,
      );
    }

    return updatedUser;
  },
  updateUserProfilePicture: async (userId: any, profilePictureUrl: string) => {
    const user = await User.findById(userId);
    if (user?.role === Role.EMPLOYER) {
      return await User.findByIdAndUpdate(
        userId,
        { 'employerDetails.logoUrl': profilePictureUrl },
        { new: true },
      );
    } else {
      return await User.findByIdAndUpdate(
        userId,
        { 'personalDetails.profilePicture': profilePictureUrl },
        { new: true },
      );
    }
  },
  updateResume: async (
    userId: any,
    resumeUrl: string,
    isVerified?: boolean,
    isPublic?: boolean,
  ) => {
    const user = await User.findById(userId);
    const existingResume = user?.jobSeekerDetails?.professionalDetails?.resume;
    return await User.findByIdAndUpdate(
      userId,
      {
        'jobSeekerDetails.professionalDetails.resume': {
          url: resumeUrl,
          isVerified:
            isVerified !== undefined ? isVerified : existingResume?.isVerified,
          isPublic:
            isPublic !== undefined ? isPublic : existingResume?.isPublic,
        },
      },
      { new: true },
    );
  },
  deleteUserProfile: async (userId: string) => {
    return await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true },
    );
  },
  getUserViews: async (userId: string) => {
    const now = new Date();
    const millisIn15Days = 15 * 24 * 60 * 60 * 1000;
    const ranges = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getTime() - millisIn15Days * (i + 1));
      const end = new Date(now.getTime() - millisIn15Days * i);
      const label = `${start.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })} - ${new Date(end.getTime() - 1).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })}`;
      ranges.push({ start, end, label });
    }

    const views = await UserView.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(now.getTime() - millisIn15Days * 6),
            $lte: now,
          },
        },
      },
      {
        $project: {
          date: 1,
          views: 1,
        },
      },
    ]);

    const viewMap = new Map();

    for (const { date, views: count } of views) {
      for (const { start, end, label } of ranges) {
        if (new Date(date) >= start && new Date(date) < end) {
          viewMap.set(label, (viewMap.get(label) || 0) + count);
          break;
        }
      }
    }

    const finalData = ranges.map(({ label }) => ({
      range: label,
      views: viewMap.get(label) || 0,
    }));

    return {
      data: finalData,
    };
  },

  incrementUserViews: async (userId: string) => {
    const today = new Date() ;
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ); 
   const data =  await UserView.updateOne(
      { userId, date: startOfDay },
      { $inc: { views: 1 } },
      { upsert: true },
    );
    return data;
  },
};
