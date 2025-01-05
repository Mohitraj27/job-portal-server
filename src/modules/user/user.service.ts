import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { config } from '@config/env';
import { IUser, Role } from './user.types';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { UserErrorMessages } from './user.enum';

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
        UserErrorMessages.INVALID_CREDENTIALS,
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
        UserErrorMessages.USER_ALREADY_EXISTS,
      );
    }
  },
};
