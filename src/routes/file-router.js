import Router from 'express';
import FileController from '../controllers/file-controller.js';

const router = new Router();
const fileController = new FileController();

router.post('/', fileController.create);
router.delete('/:id', fileController.delete);
router.get('/:id', fileController.get);

export default router;
