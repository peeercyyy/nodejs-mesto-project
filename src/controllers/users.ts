import { Request, Response } from 'express';
import {
  DEFAULT_ERROR_CODE,
  INVALID_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  NOT_FOUND_ERROR_NAME,
} from '../constants';
import { NotFoundError } from '../error';
import User, { IUser } from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' }));

export const getUserById = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      return Promise.reject(new NotFoundError('User not found'));
    }
    return res.send(user);
  })
  .catch((error) => {
    if (error.name === NOT_FOUND_ERROR_NAME) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: error.message });
    }
    if (error.name === 'CastError') {
      return res
        .status(INVALID_REQUEST_ERROR_CODE)
        .send({ message: 'Invalid user id' });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
  });

export const createUser = (req: Request<IUser>, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};

export const updateUser = (
  req: Request<Pick<IUser, 'name' | 'about'>>,
  res: Response,
) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }

      return res.send(user);
    })
    .catch((error) => {
      if (error.name === NOT_FOUND_ERROR_NAME) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: error.message });
      }
      if (error.name === 'ValidationError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};

export const updateUserAvatar = (
  req: Request<Pick<IUser, 'avatar'>>,
  res: Response,
) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }

      return res.send(user);
    })
    .catch((error) => {
      if (error.name === NOT_FOUND_ERROR_NAME) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: error.message });
      }
      if (error.name === 'ValidationError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};
