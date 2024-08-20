import {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_NAME,
  INVALID_REQUEST_ERROR_CODE,
  INVALID_REQUEST_ERROR_NAME,
  NOT_FOUND_ERROR_CODE,
  NOT_FOUND_ERROR_NAME,
} from './constants';
import { AppError } from './types/error';

export class NotFoundError extends Error implements AppError {
  statusCode: number;

  constructor(public message: string) {
    super(message);
    this.name = NOT_FOUND_ERROR_NAME;
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

export class DefaultError extends Error implements AppError {
  statusCode: number;

  constructor(public message: string) {
    super(message);
    this.name = DEFAULT_ERROR_NAME;
    this.statusCode = DEFAULT_ERROR_CODE;
  }
}

export class InvalidRequestError extends Error implements AppError {
  statusCode: number;

  constructor(public message: string) {
    super(message);
    this.name = INVALID_REQUEST_ERROR_NAME;
    this.statusCode = INVALID_REQUEST_ERROR_CODE;
  }
}

export class EmailExistError extends Error implements AppError {
  statusCode: number;

  constructor(public message: string) {
    super(message);
    this.name = 'EmailExistError';
    this.statusCode = 409;
  }
}
