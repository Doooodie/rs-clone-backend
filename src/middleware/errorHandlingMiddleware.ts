import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/api-error.js';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default (err: ApiError, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'unknown error' });
};
