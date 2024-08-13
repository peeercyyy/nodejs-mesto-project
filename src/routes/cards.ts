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
router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', deleteCardLike);

export default router;
