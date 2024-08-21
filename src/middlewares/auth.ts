import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../constants';
import { AuthError } from '../error';

// eslint-disable-next-line consistent-return
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AuthError('Not authorized'));
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return next(new AuthError('Not authorized'));
  }
  req.user = payload as { _id: string };

  next();
};

export default authMiddleware;
