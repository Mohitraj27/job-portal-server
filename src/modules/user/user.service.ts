import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { config } from '@config/env';
import { IUser, Role } from './user.types';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from './user.enum';
import crypto from 'crypto';
import { send } from 'process';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {sendEmail} from '../../utils/emailService';
const sendResetPasswordEmail = async (user: IUser) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.GOOGLE_EMAIL,
      pass: config.GOOGLE_PASSWORD,
    },
    logger: true,
    debug: true
  } as SMTPTransport.Options);
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${user.activityDetails.passwordResetToken}`;
  const mailOptions = {
    from: config.GOOGLE_EMAIL,
    to: user.personalDetails.email,
    subject: 'Password Reset',
    html: `Please click on the following link to reset your password: ${resetLink}`,
  };
  try {
    const info = await transporter.sendMail({
      ...mailOptions,
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    return throwError(httpStatus.INTERNAL_SERVER_ERROR, USER_MESSAGES.ERROR_SENDING_EMAIL);
  }
}

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
    user.activityDetails.passwordResetExpires = Date.now() + 3600000;

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
};
