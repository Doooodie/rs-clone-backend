import Router from 'express';
import CommentController from '../controllers/comment-controller.js';

const router = new Router();
const commentController = new CommentController();

router.post('/:id', commentController.create);
router.delete('/:id', commentController.delete);

export default router;
