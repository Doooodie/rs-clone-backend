import path from 'path';
import fs from 'fs/promises';
// import { constants } from 'fs';
import { fileURLToPath } from 'url';
import { File, User } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

class FileController {
  static async create(req, res, next) {
    process.stdout.write(`file-controller: create \n`);

    const { name, size, info, filePath, isFile, userId } = req.body;
    const { file } = req.files;
    process.stdout.write(
      `name=${name}, size=${size}, info=${info}, filePath=${filePath}, isFile=${isFile}\n`,
    );

    const user = await User.findOne({ where: { id: userId } });
    process.stdout.write(`userName = ${user.name}\n`);

    const userRootPath = path.resolve(dirname, '..', '..', 'public', `${user.name}`);
    process.stdout.write(`root path = ${userRootPath}\n`);

    try {
      // если файл - записать по пути, если папка - создать папку по пути
      if (`${isFile}` === 'true') {
        if (filePath === '') {
          process.stdout.write(`пишу в корень файл ${name}\n`);
          await file.mv(path.resolve(userRootPath, name));
        } else {
          const fullPath = path.resolve(userRootPath, `${filePath}`);
          process.stdout.write(`пишу в папку ${fullPath}\n`);
          await file.mv(path.resolve(fullPath, name));
        }
      } else if (`${isFile}` === 'false') {
        if (filePath === '') {
          process.stdout.write(`пишу в корень папку ${name}\n`);
          await fs.mkdir(path.resolve(userRootPath, name));
        } else {
          const fullPath = path.resolve(userRootPath, `${filePath}`);
          process.stdout.write(`пишу папку ${name} в папку ${fullPath}\n`);
          await fs.mkdir(path.resolve(fullPath, name));
        }
      }

      const uploadedFile = await File.create({
        name,
        size,
        info,
        path: filePath,
        isFile,
        userId, // ссыль на родителя
      });

      res.json(uploadedFile);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  static async delete(_, res) {
    process.stdout.write(`file-controller: delete \n`);
    res.json({ message: 'file-controller: delete' });
  }

  static async get(req, res, next) {
    process.stdout.write(`file-controller: get \n`);
    try {
      const { id } = req.params;
      // const file = await File.findOne({ where: { id } });

      res.json(`read id=${id}`);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
    res.json({ message: `file-controller: get file id = ` });
  }
}

export default FileController;
