import Router from 'express';
import FileController from '../controllers/file-controller.js';

const router = new Router();

router.post('/', FileController.create);
router.delete('/:id', FileController.delete);
router.get('/:id', FileController.get);

export default router;
