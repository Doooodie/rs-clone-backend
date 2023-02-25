import path from 'path';
import fs, { constants } from 'fs/promises';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Model } from 'sequelize-typescript';
import { File, FileModel, User } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

async function deleteDir(pathDelete: string) {
  // получить список файлов внутри этой папки
  try {
    const files = await fs.readdir(pathDelete);
    files.forEach(async (x) => {
      process.stdout.write(`файл= ${x}\n`);
      if ((await fs.stat(x)).isDirectory()) {
        process.stdout.write(`вход в папку ${x}\n`);
        await deleteDir(x);
        // удалить эту уже пустую папку
        // try {
        //   await fs.rmdir(x);
        // } catch {
        //   throw new Error(`не могу удалить пустую папку ${x}`);
        // }
      } else {
        try {
          process.stdout.write(`надо удалить файл ${x}\n`);
          // await fs.unlink(x);
        } catch (e) {
          // next(ApiError.badRequest(`can't delete file ${pathDelete}`));
          process.stdout.write(`can't delete file ${x}\n`);
        }
      }
    });
  } catch (e) {
    // надо это переработать
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    process.stdout.write(message);
  }
}

class FileController {
  static async create(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: create\n`);

    const token: string = (req.headers.authorization as string).split(' ')[1];
    const userId = parseJwt(token).id;
    process.stdout.write(`\nuserId = ${userId}\n`);

    const { name, size, info, filePath, type } = req.body;

    process.stdout.write(
      `name = ${name}, size = ${size}, info = ${info}, filePath = ${filePath}, type = ${type}\n`,
    );

    const foundUser = await User.findOne({ where: { id: userId } });

    if (foundUser) {
      process.stdout.write(`userName = ${foundUser.name}\n`);

      const userRootPath = path.resolve(dirname, '..', '..', 'public', `${foundUser.name}`);
      process.stdout.write(`userRoot path = ${userRootPath}\n`);

      let truePath;
      if (filePath === '') truePath = userRootPath;
      else truePath = path.resolve(userRootPath, `${filePath}`);
      process.stdout.write(`true path = ${truePath}\n`);

      try {
        if (`${type}` === 'file') {
          process.stdout.write(`пишу в папку ${truePath} файл ${name}\n`);
          if (!req.files) {
            throw new Error(`there isn't an uploaded file`);
          }

          const file = req.files.file as UploadedFile;
          try {
            await file.mv(path.resolve(truePath, name));
          } catch (e) {
            // throw new Error(`не могу записать файл ${name} в папку ${truePath}`);
            let message;
            if (e instanceof Error) message = e.message;
            else message = String(e);
            next(ApiError.internal(message));
          }
        } else {
          process.stdout.write(`создаю в папке ${truePath} папку ${name}\n`);
          try {
            await fs.mkdir(path.resolve(truePath, name));
          } catch {
            throw new Error(`не могу создать папку`);
          }
        }

        const uploadedFile = await File.create({
          name,
          size,
          info,
          filePath: path.resolve(truePath, name),
          parentPath: truePath,
          type,
          userId: foundUser.id,
        });
        if (uploadedFile) {
          process.stdout.write(`файл добавлен в базу\n`);
        } else {
          throw new Error(`файл не добавлен в базу`);
        }
        res.json(uploadedFile);
        // res.json({
        //   name,
        //   size,
        //   info,
        //   filePath: truePath,
        //   type,
        //   userId: foundUser.id,
        // });
      } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        next(ApiError.badRequest(message));
      }
    } else {
      throw new Error(`cant't find user ${userId} in DB`);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: delete\n`);
    try {
      // прочитать в БД путь файла
      const file: FileModel = (await File.findOne({ where: { id: req.params.id } })) as FileModel;
      if (file) {
        const pathDelete = file.filePath;

        try {
          // проверка на существование в хранилище
          await fs.access(pathDelete, constants.F_OK);
          process.stdout.write('file exists');
        } catch (e) {
          next(ApiError.badRequest((e as Error).message));
          process.stdout.write('file does not exists');
        }

        // удалить из хранилища
        // проверить, файл это или папка
        if ((await fs.stat(pathDelete)).isDirectory()) {
          // рекурсионное удаление
          await deleteDir(pathDelete);
        } else {
          try {
            process.stdout.write(`удаляю файл ${pathDelete}`);
            // await fs.unlink(pathDelete);
          } catch (e) {
            // next(ApiError.badRequest(e.message));
            next(ApiError.badRequest(`can't delete file ${pathDelete}`));
          }
        }

        // await file.destroy(); // удалить из БД
      }
    } catch (e) {
      next(ApiError.badRequest((e as Error).message));
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: get\n`);
    try {
      const { id } = req.params;

      process.stdout.write(`id файла = ${id}\n`);

      const foundFile = await File.findOne({ where: { id } });
      if (foundFile) {
        if (foundFile.type === 'file') {
          res.json(foundFile);
        } else {
          // найти всех потомков в этой папке (на выходе - массив)
          const childList = await File.findAll({ where: { parentPath: foundFile.filePath } });
          if (childList) {
            // отправить массив
            res.json(childList);
          } else {
            throw new Error(`can't read the children list of this folder from data base`);
          }
        }
      } else {
        throw new Error(`cant't read file info from data base`);
      }
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.badRequest(message));
    }
    // res.json({ message: `file-controller: get file id = ${req.params}` });
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: getAll\n`);
    try {
      // определить id пользователя из token и по нему выдать список ВСЕХ файлов этого пользоваталя
      // или только в корне?
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      next(ApiError.badRequest(message));
    }
    res.json({ message: `file-controller: getAll` });
  }
}

export default FileController;
