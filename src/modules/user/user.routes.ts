import { Router } from 'express';
import passport from 'passport';
import { userController } from './user.controller';
import { responseMiddleware } from '@middlewares/responseMiddleware';
import { validateLoginMiddleware, validateUserMiddleware } from './user.validation';

const userRouter = Router();

userRouter.use(responseMiddleware);

userRouter
  .route('/register')
  .post(validateUserMiddleware, userController.register);

userRouter.route('/login').post(validateLoginMiddleware, userController.login);

userRouter
  .route('/protected')
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user });
  });

userRouter
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter
  .route('/auth/google/callback')
  .get(passport.authenticate('google', { session: false }), (req, res) => {
    interface AuthenticatedUser {
      name: string;
      email: string;
    }

    const user = req.user as AuthenticatedUser;
    const { name, email } = user;

    res.send(`
      <html>
        <head>
          <title>Google Auth Success</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 50px;
            }
            h1 {
              color: #4CAF50;
            }
            button {
              padding: 10px 20px;
              font-size: 16px;
              background-color: #4285F4;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>Google Authentication Successful</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <button onclick="window.location.href='api/users/auth/google'">Login Again</button>
        </body>
      </html>
    `);
  });

userRouter.route('/').get((req, res) => {
  res.send(`
    <html>
      <head>
        <title>Google Authentication Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
          }
          button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Google Authentication Test</h1>
        <button onclick="window.location.href='/api/users/auth/google'">Login with Google</button>
      </body>
    </html>
  `);
});

export default userRouter;
