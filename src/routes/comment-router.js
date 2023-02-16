import Router from 'express';
import CommentController from '../controllers/comment-controller.js';

const router = new Router();

router.post('/:id', CommentController.create);
router.delete('/:id', CommentController.delete);

export default router;
