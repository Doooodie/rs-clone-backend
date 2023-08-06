import { Router } from 'express';
import FileController from '../controllers/file-controller.js';
import authMiddleWare from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleWare, FileController.create);
router.delete('/:id', authMiddleWare, FileController.delete);
router.get('/:id', authMiddleWare, FileController.get);
router.get('/', authMiddleWare, FileController.getRoot);
router.put('/:id', authMiddleWare, FileController.update);

export default router;
