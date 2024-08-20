import { ObjectId } from 'mongoose';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    _id: string | ObjectId;
  }
}
