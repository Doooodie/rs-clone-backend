import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { file } from '../models/models.js';
import ApiError from '../error/api-error.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

class FileController {
  // TODO: rewrite class
  async create(req, res, next) {
    try {
      // TODO: remove unused var
      const { name, size, info, userId } = req.body;
      const { img } = req.files;

      const fileName = `${uuidv4()}.jpg`;
      img.mv(path.resolve(dirname, '..', 'public', fileName));

      const imageFile = await file.create({ name, size, info, img: fileName });

      res.json(imageFile);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  // TODO: remove unused function params
  async delete(req, res) {
    res.json({ message: 'file-controller: delete' });
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;
      // TODO: rename var if needed, remove var if not
      const file = await file.findOne({ where: { id } });

      res.json(`something was read... id=${id}`);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
    res.json({ message: `file-controller: get file id = ${req.params}` });
  }
}

export default FileController;
