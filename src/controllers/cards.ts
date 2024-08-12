import { Request, Response } from 'express';
import Card, { ICard } from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch((error) => res.status(400).send(error));

export const createCard = (req: Request<ICard>, res: Response) => {
  const { name, link } = req.body;
  // TODO: remove after authorization
  // @ts-ignore
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => res.status(400).send(error));
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => res.send(card))
  .catch((error) => res.status(400).send(error));

export const addCardLike = (req: Request, res: Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    // @ts-ignore
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((error) => res.status(400).send(error));
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
    .catch((error) => res.status(400).send(error));
};
