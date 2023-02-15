import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { file } from '.././models/models.js';
import ApiError from '../error/api-error.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileController {
    async create(req, res, next) {
        try {
            let { name, size, info, userId } = req.body;
            const { img } = req.files;

            let fileName = uuidv4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'public', fileName));

            const imageFile = await file.create({ name, size, info, img: fileName });

            res.json(imageFile);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    };

    async delete(req, res) {
        res.json({ message: 'file-controller: delete'});
    }

    async get(req, res, next) {
        try {
            const { id } = req.params;
            const file = await file.findOne({ where: { id } });

            res.json(`something was read... id=${id}`);
        } catch(e) {
            next(ApiError.badRequest(e.message));
        }
        res.json({ message: `file-controller: get file id = ${req.params}`});
    }
}

export default FileController;
