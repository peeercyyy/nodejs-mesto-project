import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  addCardLike,
  createCard,
  deleteCard,
  deleteCardLike,
  getCards,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete(
  '/:cardId',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }),
  deleteCard
);

router.put(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }),
  addCardLike
);
router.delete(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }),
  deleteCardLike
);

export default router;
