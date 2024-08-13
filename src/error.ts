import { DEFAULT_ERROR_NAME, INVALID_REQUEST_ERROR_NAME, NOT_FOUND_ERROR_NAME } from './constants';

export class NotFoundError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = NOT_FOUND_ERROR_NAME;
  }
}

export class DefaultError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = DEFAULT_ERROR_NAME;
  }
}

export class InvalidRequestError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = INVALID_REQUEST_ERROR_NAME;
  }
}