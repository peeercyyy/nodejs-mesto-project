import { Request, Response } from 'express';
import {
  DEFAULT_ERROR_CODE,
  INVALID_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  NOT_FOUND_ERROR_NAME,
} from '../constants';
import { NotFoundError } from '../error';
import Card, { ICard } from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' }));

export const createCard = (req: Request<ICard>, res: Response) => {
  const { name, link } = req.body;
  // TODO: remove after authorization
  // @ts-ignore
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      return Promise.reject(new NotFoundError('Card not found'));
    }

    return res.send(card);
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return res
        .status(INVALID_REQUEST_ERROR_CODE)
        .send({ message: 'Invalid card id' });
    }
    if (error.name === NOT_FOUND_ERROR_NAME) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: error.message });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
  });

export const addCardLike = (req: Request, res: Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    // @ts-ignore
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Card not found'));
      }
      return res.send(card);
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
          .send({ message: 'Invalid card id' });
      }
      if (error.name === 'ValidationError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};

export const deleteCardLike = (req: Request, res: Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    // @ts-ignore
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === NOT_FOUND_ERROR_NAME) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: error.message });
      }
      if (error.name === 'CastError') {
        return res
          .status(INVALID_REQUEST_ERROR_CODE)
          .send({ message: 'Invalid card id' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Server error' });
    });
};
