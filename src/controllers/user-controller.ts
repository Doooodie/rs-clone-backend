import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../error/api-error.js';
import { User } from '../models/models.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const rootPath = path.resolve(dirname, '..', '..', 'public');

const SECRET_KEY = 'badoone';

interface IAuthCheckUser extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

function generateJwt(id: number, name: string, email: string) {
  return jwt.sign({ id, name, email }, SECRET_KEY, { expiresIn: '1y' });
}

class UserController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new Error(`input correct data`);
      }

      const reqName = await User.findOne({ where: { name } });
      if (reqName) {
        throw new Error(`user with name «${name}» already exists`);
      }

      const reqEmail = await User.findOne({ where: { email } });
      if (reqEmail) {
        throw new Error(`e-mail «${email}» is already in use`);
      }

      const hashPassword = await bcrypt.hash(password, 4);

      const newUser = await User.create({ name, email, password: hashPassword });
      if (!newUser) {
        throw new Error(`can't create new user`);
      }

      if (newUser.id) {
        const token = generateJwt(newUser.id, newUser.name, newUser.email);

        try {
          await fs.mkdir(path.resolve(rootPath, `${newUser.name}`));
        } catch (e) {
          let message;
          if (e instanceof Error) message = e.message;
          else message = String(e);
          next(ApiError.internal(message));
        }
        res.json({
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        });
      }
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.badRequest(message));
    }

    return null;
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    let user;
    try {
      user = await User.findOne({ where: { name, email } });
      if (user) {
        process.stdout.write(
          `user.id = ${user.id}, user.name = ${user.name}, user.email = ${user.email}, user.password = ${user.password}`,
        );
      }
      if (!user) {
        next(ApiError.internal(`User named «${name}» with email «${email}» not found`));
      }
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.internal(message));
    }

    try {
      let comparePassword;
      if (user) {
        comparePassword = bcrypt.compareSync(password, user.password);
      }
      if (!comparePassword) {
        next(ApiError.internal('Wrong password specified'));
      } else if (user && user.id) {
        const token = generateJwt(user.id, user.name, user.email);
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.internal(message));
    }
  }

  static async check(req: IAuthCheckUser, res: Response) {
    if (req.user) {
      const token = generateJwt(req.user.id, req.user.name, req.user.email);
      res.json({ token });
    }
  }
}

export default UserController;
