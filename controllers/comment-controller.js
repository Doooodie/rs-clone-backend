class CommentController {
    async create(req, res) {
        // console.log('user-controller: login');
        res.json({ message: 'comment-controller: create'});
    }

    async delete(req, res) {
        // console.log('user-controller: check');
        res.json({ message: 'comment-controller: delete'});
    }
}

export default CommentController;
