class CommentController {
  // TODO: rewrite class
  async create(req, res) {
    res.json({ message: 'comment-controller: create' });
  }

  async delete(req, res) {
    res.json({ message: 'comment-controller: delete' });
  }
}

export default CommentController;
