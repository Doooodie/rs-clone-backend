import { Request, Response } from 'express';
import ApiError from '../error/api-error.js';

export default (err: ApiError, _: Request, res: Response) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'unknown error' });
};
