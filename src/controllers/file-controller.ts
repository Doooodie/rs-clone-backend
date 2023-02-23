import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { File, User } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

class FileController {
  static async create(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: create \n`);

    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      const userId = parseJwt(token).id;
      process.stdout.write(`\nuserId = ${userId}\n`);

      const { name, size, info, filePath, type } = req.body;

      if (req.files) {
        // WARN: line 57
        // const { file } = req.files;

        process.stdout.write(
          `name = ${name}, size = ${size}, info = ${info}, filePath = ${filePath}, type = ${type}\n`,
        );

        const foundUser = await User.findOne({ where: { id: userId } });

        if (foundUser) {
          process.stdout.write(`userName = ${foundUser.name}\n`);

          const userRootPath = path.resolve(
            dirname,
            '..',
            '..',
            '..',
            'public',
            `${foundUser.name}`,
          );
          process.stdout.write(`root path = ${userRootPath}\n`);

          let truePath;
          if (filePath === '') truePath = userRootPath;
          else truePath = path.resolve(userRootPath, `${filePath}`);

          try {
            if (`${type}` === 'file') {
              process.stdout.write(`пишу в папку ${truePath} файл ${name}\n`);
              // TODO: add correct type
              // await file.mv(path.resolve(truePath, name));
            } else {
              process.stdout.write(`создаю в папке ${truePath} папку ${name}\n`);
              await fs.mkdir(path.resolve(truePath, name));
            }

            const uploadedFile = await File.create({
              name,
              size,
              info,
              path: truePath,
              type,
              userId: foundUser.id,
            });

            res.json(uploadedFile);
          } catch (e) {
            let message;
            if (e instanceof Error) message = e.message;
            else message = String(e);
            next(ApiError.badRequest(message));
          }
        }
      }
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: delete \n`);

    try {
      const file = await File.findOne({ where: { id: req.params.id } });
      if (file) await file.destroy();
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.badRequest(message));
    }

    res.json({ message: 'file-controller: delete' });
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: get \n`);
    try {
      const { id } = req.params;
      res.json(`read id=${id}`);
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.badRequest(message));
    }
    res.json({ message: `file-controller: get file id = ` });
  }
}

export default FileController;
