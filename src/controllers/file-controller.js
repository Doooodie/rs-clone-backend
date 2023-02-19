import path from 'path';
import fs from 'fs/promises';
// import { constants } from 'fs';
import { fileURLToPath } from 'url';
import { File, User } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

class FileController {
  static async create(req, res, next) {
    process.stdout.write(`file-controller: create \n`);

    const token = req.headers.authorization.split(' ')[1];

    const userId = parseJwt(token).id;
    process.stdout.write(`\nuserId = ${userId}\n`);

    const { name, size, info, filePath, type } = req.body;
    // const { name, size, info, filePath, type, userId } = req.body;

    let { file } = {};
    if (req.files) ({ file } = req.files);

    process.stdout.write(
      `name = ${name}, size = ${size}, info = ${info}, filePath = ${filePath}, type = ${type}\n`,
    );

    const foundUser = await User.findOne({ where: { id: userId } });
    process.stdout.write(`userName = ${foundUser.name}\n`);

    const userRootPath = path.resolve(dirname, '..', '..', 'public', `${foundUser.name}`);
    process.stdout.write(`root path = ${userRootPath}\n`);

    let truePath;
    if (filePath === '') truePath = userRootPath;
    else truePath = path.resolve(userRootPath, `${filePath}`);

    try {
      if (`${type}` === 'file') {
        process.stdout.write(`пишу в папку ${truePath} файл ${name}\n`);
        await file.mv(path.resolve(truePath, name));
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
        userId: foundUser.id, // ссыль на родителя
      });

      res.json(uploadedFile);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  static async delete(req, res, next) {
    process.stdout.write(`file-controller: delete \n`);

    try {
      // найти путь файла и удалить из базы
      const file = await File.findOne({ where: { id: req.params.id } });
      // const pathDelete = file.filePath;
      await file.destroy();

      // удалить из хранилища
      // проверить, файл это или папка
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }

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
