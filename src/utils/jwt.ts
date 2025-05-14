import jwt from 'jsonwebtoken';

export const generateToken = (
  payload: object,
  secret: string,
  expiresIn: jwt.SignOptions['expiresIn'],
): string => {
  const options: jwt.SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};
