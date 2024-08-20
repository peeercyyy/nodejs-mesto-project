import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get(
  '/:id',
  celebrate({ params: Joi.object().keys({ id: Joi.string().length(24) }) }),
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({ name: Joi.string(), about: Joi.string() }),
  }),
  updateUser
);

router.patch(
  '/me/avatar',
  celebrate({ body: Joi.object().keys({ avatar: Joi.string().uri() }) }),
  updateUserAvatar
);

export default router;
