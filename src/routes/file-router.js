import Router from 'express';
import FileController from '../controllers/file-controller.js';
import authMiddleWare from '../middleware/authMiddleware.js';

const router = new Router();

router.post('/', authMiddleWare, FileController.create);
router.delete('/:id', authMiddleWare, FileController.delete);
router.get('/:id', FileController.get);

export default router;
