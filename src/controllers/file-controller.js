import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { File } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

class FileController {
  static async create(req, res, next) {
    process.stdout.write(`file-controller: create \n`);

    try {
      const { name, size, info } = req.body;
      const { img } = req.files;

      const fileName = `${uuidv4()}.jpg`;
      img.mv(path.resolve(dirname, '..', 'public', fileName));

      const imageFile = await File.create({ name, size, info, img: fileName });

      res.json(imageFile);
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
