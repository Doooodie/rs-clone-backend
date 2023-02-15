import ApiError from '../error/api-error.js';

class UserController {
  // TODO: rewrite class
  async registration(req, res) {
    res.json({ message: 'user-controller: registration' });
  }

  async login(req, res) {
    res.json({ message: 'user-controller: login' });
  }

  async check(req, res, next) {
    process.stdout.write('user-controller: check');
    const { id } = req.query;

    if (!id) {
      next(ApiError.badRequest('id is missing from the request'));
    }

    res.json(id);
  }
}

export default UserController;
