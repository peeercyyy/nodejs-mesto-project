import { Request, Response } from 'express';
import User, { IUser } from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch((error) => res.status(400).send(error));

export const getUserById = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => res.send(user))
  .catch((error) => res.status(400).send(error));

export const createUser = (req: Request<IUser>, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => res.status(400).send(error));
};

export const updateUser = (
  req: Request<Pick<IUser, 'name' | 'about'>>,
  res: Response,
) => {
  const { name, about } = req.body;
  // @ts-ignore
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((error) => res.status(400).send(error));
};

export const updateUserAvatar = (
  req: Request<Pick<IUser, 'avatar'>>,
  res: Response,
) => {
  const { avatar } = req.body;
  // @ts-ignore
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((error) => res.status(400).send(error));
};
