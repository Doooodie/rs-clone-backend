// TODO: remove unused import
// import ApiError from '../error/api-error.js';

class AccessController {
  // TODO: rewrite class
  async create(req, res) {
    const { file, user } = req.body;
    res.json({ message: 'access-controller: create' });
  }

  async delete(req, res) {
    res.json({ message: 'access-controller: delete' });
  }
}

export default AccessController;
