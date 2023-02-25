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
  process.stdout.write(`вход в функцию deleteDir(${pathDelete})\nсписок файлов:\n`);
  // получить список файлов внутри этой папки
  try {
    const files = await fs.readdir(pathDelete);
    files.forEach(async (x) => {
      // x - имя файла/папки
      process.stdout.write(`файл = ${x}\n`);
      if ((await fs.stat(path.resolve(pathDelete, x))).isDirectory()) {
        process.stdout.write(`вход в папку ${path.resolve(pathDelete, x)}\n`);
        await deleteDir(path.resolve(pathDelete, x));
        // удалить эту уже пустую папку
        // try {
        //   process.stdout.write(`Внутри папки ${pathDelete} все поудалял, сейчас буду удалять ее\n`);
        //   // из хранилища
        //   await fs.rmdir(pathDelete);
        //   // из БД
        //   await File.destroy({
        //     where: {
        //       filePath: path.resolve(pathDelete),
        //     },
        //   });
        // } catch {
        //   throw new Error(`не могу удалить пустую папку ${pathDelete}\n`);
        // }
      } else {
        try {
          process.stdout.write(`пытаюсь удалить файл ${path.resolve(pathDelete, x)}\n`);
          // try {
          //   await fs.unlink(path.resolve(pathDelete, x));
          // } catch {
          //   throw new Error(`не могу удалить файл ${x}`);
          // }
          // удалить из базы
          await File.destroy({
            where: {
              filePath: path.resolve(pathDelete, x),
            },
          });
        } catch (e) {
          // next(ApiError.badRequest(`can't delete file ${pathDelete}`));
          process.stdout.write(`can't delete file ${path.resolve(pathDelete, x)}\n`);
        }
      }
    });
    // удалить эту уже пустую папку
    try {
      process.stdout.write(`Внутри папки ${pathDelete} все поудалял, сейчас буду удалять ее\n`);
      // из хранилища
      // await fs.rmdir(pathDelete, { recursive: true });
      // из БД
      await File.destroy({
        where: {
          filePath: path.resolve(pathDelete),
        },
      });
    } catch {
      throw new Error(`не могу удалить пустую папку ${pathDelete}\n`);
    }
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

  // ---------------------- удаление --------------------------------
  static async delete(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: delete\n`);
    try {
      // прочитать в БД путь файла
      const file: FileModel = (await File.findOne({ where: { id: req.params.id } })) as FileModel;
      if (file) {
        const pathDelete = file.filePath;
        process.stdout.write(`pathDelete = ${pathDelete}\n`);

        try {
          // проверка на существование в хранилище
          await fs.access(pathDelete, constants.F_OK);
          process.stdout.write('file exists\n');
        } catch (e) {
          next(ApiError.badRequest((e as Error).message));
          process.stdout.write('file does not exists\n');
        }

        // удалить из хранилища
        // проверить, файл это или папка
        if ((await fs.stat(pathDelete)).isDirectory()) {
          // рекурсивное удаление
          // сначала - БД
          await deleteDir(pathDelete);
          // затем - хранилище
          try {
            await fs.rmdir(pathDelete, { recursive: true });
          } catch {
            throw new Error(`не могу удалить папку ${pathDelete}`);
          }
        } else {
          try {
            process.stdout.write(`удаляю файл ${pathDelete}\n`);
            // удалить из базы
            try {
              await file.destroy();
            } catch {
              throw new Error(`can't delete from data base`);
            }
            // удалить из хранилища
            try {
              await fs.unlink(pathDelete);
            } catch {
              throw new Error(`can't delete from storage`);
            }
          } catch (e) {
            // next(ApiError.badRequest(e.message));
            next(ApiError.badRequest(`can't delete file ${pathDelete}\n`));
          }
        }

        // await file.destroy(); // удалить из БД
        res.json({ message: `file id=${req.params.id} was deleted` });
      }
    } catch (e) {
      next(ApiError.badRequest((e as Error).message));
    }
    // res.json({ message: `delete` });
  }

  // ------------------- запрос GET ---------------------
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
            // вернуть массив
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

  static async getRoot(req: Request, res: Response, next: NextFunction) {
    process.stdout.write(`file-controller: getAll\n`);

    // определить id пользователя из token
    const token: string = (req.headers.authorization as string).split(' ')[1];
    const userId = parseJwt(token).id;
    process.stdout.write(`\nuserId = ${userId}\n`);

    const foundUser = await User.findOne({ where: { id: userId } });
    if (foundUser) {
      process.stdout.write(`userName = ${foundUser.name}\n`);

      const userRootPath = path.resolve(dirname, '..', '..', 'public', `${foundUser.name}`);
      process.stdout.write(`userRoot path = ${userRootPath}\n`);

      try {
        // найти всех потомков в этой корневой папке (на выходе - массив)
        const childList = await File.findAll({ where: { parentPath: userRootPath } });
        if (childList) {
          // вернуть массив
          res.json(childList);
        } else {
          throw new Error(`can't read the children list of root folder from data base`);
        }
      } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        next(ApiError.badRequest(message));
      }
      // res.json({ message: `file-controller: getAll` });
    } else {
      throw new Error(`user id=${userId} not found in the data base`);
    }
  }
}

export default FileController;
