import { celebrate, errors, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { NOT_FOUND_ERROR_CODE } from './constants';
import { createUser, login } from './controllers/users';
import authMiddleware from './middlewares/auth';
import errorMiddleware from './middlewares/error';
import { errorLogger, requestLogger } from './middlewares/logger';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
      name: Joi.string().optional(),
      about: Joi.string().optional(),
      avatar: Joi.string().optional(),
    }),
  }),
  createUser
);
app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) =>
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Page not found' })
);
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log('listening in port 3000');
});
