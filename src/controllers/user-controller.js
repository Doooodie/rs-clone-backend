import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import ApiError from '../error/api-error.js';
import { User } from '../models/models.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const SECRET_KEY = 'badoone';

function generateJwt(id, name, email) {
  return jwt.sign({ id, name, email }, SECRET_KEY, { expiresIn: '1h' });
}

class UserController {
  static async registration(req, res, next) {
    // process.stdout.write(`user-controller: registration \n`);

    try {
      const { name, email, password } = req.body;
      // process.stdout.write(`name = ${name}, email = ${email}, password = ${password} \n`);

      if (!name || !email || !password) {
        next(ApiError.badRequest('input correct data'));
      }

      const reqName = await User.findOne({ where: { name } });
      if (reqName) {
        next(ApiError.badRequest(`user with name «${name}» already exists`));
      }

      const reqEmail = await User.findOne({ where: { email } });
      if (reqEmail) {
        next(ApiError.badRequest(`e-mail «${email}» is already in use`));
      }

      const hashPassword = await bcrypt.hash(password, 4);

      const newUser = await User.create({ name, email, password: hashPassword });
      if (!newUser) {
        next(ApiError.internal(`can't create new user`));
      }

      const token = generateJwt(newUser.id, newUser.name, newUser.email);

      // create a folder for new user into /PUBLIC
      try {
        await fs.mkdir(path.resolve(dirname, '..', '..', 'public', `${newUser.name}`));
      } catch (e) {
        next(ApiError.internal(e.message));
      }
      // -----------------------------
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }

    return null;
  }

  static async login(req, res, next) {
    // process.stdout.write(`user-controller: login \n`);

    const { name, email, password } = req.body;

    // find user in DB by name & email fields
    // const user = await User.findOne({ where: { name, email } });
    // if (!user) {
    //   next(ApiError.internal(`User named «${name}» with email «${email}» not found`));
    // }

    let user;
    try {
      user = await User.findOne({ where: { name, email } });
      process.stdout.write(
        `user.id = ${user.id}, user.name = ${user.name}, user.email = ${user.email}, user.password = ${user.password}`,
      );
      if (!user) {
        next(ApiError.internal(`User named «${name}» with email «${email}» not found`));
      }
    } catch (e) {
      next(ApiError.internal(e.message));
    }

    // const comparePassword = bcrypt.compareSync(password, user.password);
    // if (!comparePassword) {
    //   next(ApiError.internal('Wrong password specified'));
    // }

    let comparePassword;
    try {
      comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        next(ApiError.internal('Wrong password specified'));
      }
    } catch (e) {
      next(ApiError.internal(e.message));
    }

    const token = generateJwt(user.id, user.name, user.email);
    res.json({ token });
  }

  static async check(req, res) {
    const token = generateJwt(req.user.id, req.user.name, req.user.email);
    res.json({ token });
  }
}

export default UserController;
