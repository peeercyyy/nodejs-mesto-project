import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { InvalidRequestError, NotFoundError } from '../error';
import Card, { ICard } from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);

export const createCard = (
  req: Request<ICard>,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) =>
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Card not found'));
      }

      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(
          new InvalidRequestError('You can delete only your cards')
        );
      }

      return res.send(card);
    })
    .catch(next);

export const addCardLike = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id as ObjectId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Card not found'));
      }
      return res.send(card);
    })
    .catch(next);
};

export const deleteCardLike = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id as ObjectId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Card not found'));
      }
      return res.send(card);
    })
    .catch(next);
};
