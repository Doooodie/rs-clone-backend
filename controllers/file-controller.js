import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { File } from '.././models/models.js';
import ApiError from '../error/api-error.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileController {
    async create(req, res, next) {
        console.log('file-controller: create');

        try {
            let { name, size, info, isFile, userId } = req.body;
            const { img } = req.files;

            let fileName = uuidv4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'public', fileName));

            const imageFile = await File.create({ name, size, info, img: fileName });

            res.json(imageFile);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    };

    async delete(req, res) {
        console.log('file-controller: delete');
        res.json({ message: 'file-controller: delete'});
    }

    async get(req, res, next) {
        console.log('file-controller: get');
        try {
            const { id } = req.params;
            const file = await File.findOne({ where: { id } });

            res.json(`read id=${id}`);
        } catch(e) {
            next(ApiError.badRequest(e.message));
        }
        res.json({ message: `file-controller: get file id = `});
    }
}

export default FileController;
