import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = 'badoone';
interface IAuthInfoRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: IAuthInfoRequest, res: Response, next: NextFunction) => {
  if (
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'PUT' &&
    req.method !== 'DELETE'
  ) {
    next();
  }

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'User not authorized' });
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;

      next();
    }
  } catch (e) {
    res.status(401).json({ message: 'User not authorized' });
  }
};
