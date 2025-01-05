import passport from 'passport';
import jwtStrategy from './jwtStrategy';
import googleStrategy from './googleStrategy';



passport.use('jwt', jwtStrategy);
passport.use('google', googleStrategy);

export default passport;
