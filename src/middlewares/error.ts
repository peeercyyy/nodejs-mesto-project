import { Request, Response } from 'express';
import { INVALID_REQUEST_ERROR_CODE } from '../constants';
import { AppError } from '../types/error';

const error = (err: AppError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  if (err.name === 'ValidationError') {
    return res
      .status(INVALID_REQUEST_ERROR_CODE)
      .send({ message: err.message });
  }

  if (err.name === 'CastError') {
    return res
      .status(INVALID_REQUEST_ERROR_CODE)
      .send({ message: 'Invalid id' });
  }

  return res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default error;
