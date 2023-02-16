// import ApiError from '../error/api-error.js';
// import { Access } from '../models/models.js';

class AccessController {
  static async create(req, res) {
    // const { file, user } = req.body;
    res.json({ message: 'access-controller: create' });
  }

  static async delete(req, res) {
    res.json({ message: 'access-controller: delete' });
  }
}

export default AccessController;
