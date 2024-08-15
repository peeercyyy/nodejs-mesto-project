import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { NOT_FOUND_ERROR_CODE } from './constants';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66ba207febd9f178335d5264',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req: Request, res: Response) => {
  return res.status(NOT_FOUND_ERROR_CODE).end();
});

app.listen(3000, () => {
  console.log('listening in port 3000');
});
