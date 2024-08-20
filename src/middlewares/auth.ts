import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../constants';

const handleAuthError = (res: Response) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

// eslint-disable-next-line consistent-return
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return handleAuthError(res);
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload as { _id: string };

  next();
};

export default authMiddleware;
