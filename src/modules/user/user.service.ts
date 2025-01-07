import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { config } from '@config/env';
import { IUser, Role } from './user.types';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';
import crypto from 'crypto';
import {sendEmail} from '../../utils/emailService';

export const userService = {
  registerUser: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<IUser> => {
    const existingUser = await User.findOne({ 'personalDetails.email': email });
    if (existingUser) {
      throwError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role: Role.JOBSEEKER,
      personalDetails: {
        firstName,
        lastName:lastName||'',
        dateOfBirth,
        email,
        password: hashedPassword,
      },
    });

    return newUser.save();
  },
  loginUser: async (email: string, password: string): Promise<string> => {
    const user = await User.findOne({ 'personalDetails.email': email }).select(
      '+personalDetails.password',
    );
    if (!user) {
      throwError(
        httpStatus.UNAUTHORIZED,
        USER_MESSAGES.INVALID_CREDENTIALS,
      );
    }
    if ( user && (!(await bcrypt.compare(password, user.personalDetails.password!)))) {
      throwError(
        httpStatus.UNAUTHORIZED,
        USER_MESSAGES.INVALID_CREDENTIALS,
      );
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
      return token;
    } else {
      return throwError(
        httpStatus.UNAUTHORIZED,
        USER_MESSAGES.USER_ALREADY_EXISTS,
      );
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
    const emailContent = `
      <p>Hello ${user.personalDetails.firstName},</p>
      <p>You requested to reset your password. Please click the link below to reset it:</p>
      <a href="${resetLink}">Reset Password</a>
    `;
    await sendEmail(user.personalDetails.email, 'Forget Password Request', emailContent);
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
    user.activityDetails.passwordResetExpires =  undefined;
    await user.save();

    return user;
  },
  changePassword: async (email: string, oldPassword: string, newPassword: string): Promise<IUser> => {
    const user = await User.findOne({ 'personalDetails.email': email });
    if (!user) {
      return throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.USER_NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(oldPassword, user.personalDetails.password!);
    if (!isMatch) {
      return throwError(httpStatus.UNAUTHORIZED, USER_MESSAGES.INVALID_PASSWORD);
    }
    user.personalDetails.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
  },
};
