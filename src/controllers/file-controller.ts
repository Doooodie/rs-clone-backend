import path from 'path';
import fs, { constants } from 'fs/promises';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { File, FileModel, User } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

async function deleteFromDB(pathDelete: string) {
  try {
    const files = await fs.readdir(pathDelete);
    files.forEach(async (x) => {
      if ((await fs.stat(path.resolve(pathDelete, x))).isDirectory()) {
        try {
          await deleteFromDB(path.resolve(pathDelete, x));
        } catch {
          throw new Error(`can't delete ${path.resolve(pathDelete, x)} from DB`);
        }
      } else {
        try {
          await File.destroy({
            where: {
              filePath: path.resolve(pathDelete, x),
            },
          });
        } catch {
          throw new Error(`can't delete ${path.resolve(pathDelete, x)} from DB`);
        }
      }
    });

    try {
      await File.destroy({
        where: {
          filePath: path.resolve(pathDelete),
        },
      });
    } catch {
      throw new Error(`can't delete empty folder ${pathDelete} from DB`);
    }
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    process.stdout.write(message);
  }
}

class FileController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const token: string = (req.headers.authorization as string).split(' ')[1];
    const userId = parseJwt(token).id;
    const { name, size, info, filePath, type } = req.body;
    const foundUser = await User.findOne({ where: { id: userId } });

    if (foundUser) {
      const userRootPath = path.resolve(dirname, '..', '..', 'public', `${foundUser.name}`);

      let truePath;
      if (filePath === '') truePath = userRootPath;
      else truePath = path.resolve(userRootPath, `${filePath}`);

      try {
        if (`${type}` === 'file') {
          if (!req.files) {
            throw new Error(`there isn't an uploaded file`);
          }

          const file = req.files.file as UploadedFile;
          try {
            await file.mv(path.resolve(truePath, name));
          } catch (e) {
            let message;
            if (e instanceof Error) message = e.message;
            else message = String(e);
            next(ApiError.internal(message));
          }
        } else {
          try {
            await fs.mkdir(path.resolve(truePath, name));
          } catch {
            throw new Error(`can't create a folder`);
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
          res.json(uploadedFile);
        } else {
          throw new Error(`can't add file to DB`);
        }
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
    try {
      const file: FileModel = (await File.findOne({ where: { id: req.params.id } })) as FileModel;
      if (file) {
        const pathDelete = file.filePath;

        try {
          await fs.access(pathDelete, constants.F_OK);
        } catch (e) {
          next(ApiError.badRequest((e as Error).message));
        }

        if ((await fs.stat(pathDelete)).isDirectory()) {
          await deleteFromDB(pathDelete);

          try {
            await fs.rm(pathDelete, { recursive: true });
          } catch {
            throw new Error(`can't delete folder ${pathDelete}`);
          }
        } else {
          try {
            try {
              await file.destroy();
            } catch {
              throw new Error(`can't delete from data base`);
            }

            try {
              await fs.unlink(pathDelete);
            } catch {
              throw new Error(`can't delete from storage`);
            }
          } catch (e) {
            next(ApiError.badRequest((e as Error).message));
          }
        }
        res.json({ message: `file id=${req.params.id} was deleted` });
      }
    } catch (e) {
      next(ApiError.badRequest((e as Error).message));
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const foundFile = await File.findOne({ where: { id } });
      if (foundFile) {
        if (foundFile.type === 'file') {
          res.json(foundFile);
        } else {
          const childList = await File.findAll({ where: { parentPath: foundFile.filePath } });
          if (childList) {
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
  }

  static async getRoot(req: Request, res: Response, next: NextFunction) {
    const token: string = (req.headers.authorization as string).split(' ')[1];
    const userId = parseJwt(token).id;
    const foundUser = await User.findOne({ where: { id: userId } });
    if (foundUser) {
      const userRootPath = path.resolve(dirname, '..', '..', 'public', `${foundUser.name}`);

      try {
        const childList = await File.findAll({ where: { parentPath: userRootPath } });
        if (childList) {
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
    } else {
      throw new Error(`user id=${userId} not found in the data base`);
    }
  }
}

export default FileController;
