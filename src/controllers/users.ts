import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../constants';
import { AuthError, EmailExistError, NotFoundError } from '../error';
import User, { IUser } from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) =>
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch(next);

export const createUser = (
  req: Request<IUser>,
  res: Response,
  next: NextFunction
) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash: string) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new EmailExistError('Email already exist'));
      }
      return next(err);
    });
};

export const updateUser = (
  req: Request<Pick<IUser, 'name' | 'about'>>,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }

      return res.send(user);
    })
    .catch(next);
};

export const updateUserAvatar = (
  req: Request<Pick<IUser, 'avatar'>>,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }

      return res.send(user);
    })
    .catch(next);
};

export const login = (
  req: Request<IUser>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Invalid email or password'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Invalid email or password'));
        }
        const token = jwt.sign({ _id: user._id }, SECRET, {
          expiresIn: '7d',
        });
        return res
          .cookie('token', token, { httpOnly: true, maxAge: 604800 })
          .end();
      });
    })
    .catch(next);
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch(next);
};
