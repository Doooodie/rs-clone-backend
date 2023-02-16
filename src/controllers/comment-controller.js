// import { Comment } from '.././models/models.js';

class CommentController {
  static async create(req, res) {
    res.json({ message: 'comment-controller: create' });
  }

  static async delete(req, res) {
    res.json({ message: 'comment-controller: delete' });
  }
}

export default CommentController;
