import {
  Strategy as GoogleStrategy,
  Profile,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-google-oauth20';
import User from '@modules/user/user.model';
import { config } from '@config/env';
import { AccountStatus, IUser, Provider, Role } from '@modules/user/user.types';

const googleOptions: StrategyOptionsWithRequest = {
  clientID: config.GOOGLE_CLIENT_ID as string,
  clientSecret: config.GOOGLE_CLIENT_SECRET as string,
  callbackURL: config.GOOGLE_CALLBACK_URL as string,
  passReqToCallback: true, 
};

const googleStrategy = new GoogleStrategy(
  googleOptions,
  async (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => {
    try {
      
    
      const role = req.query.role || Role.JOBSEEKER; 
      
      const existingUser = await User.findOne({
        'socialLogins.provider': Provider.GOOGLE,
        'socialLogins.providerId': profile.id,
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser: IUser = await User.create({
        role: role as Role, 
        personalDetails: {
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          email: profile.emails?.[0]?.value || '',
          profilePicture: profile.photos?.[0]?.value || '',
        },
        socialLogins: [
          {
            provider: Provider.GOOGLE,
            providerId: profile.id,
          },
        ],
        activityDetails: {
          accountStatus: AccountStatus.ACTIVE,
          accountCreationDate: new Date(),
        },
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  },
);

export default googleStrategy;
