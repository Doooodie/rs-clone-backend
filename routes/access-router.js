import Router from 'express';
import AccessController from '../controllers/access-controller.js';

const router = new Router();
const accessController = new AccessController();

router.post('/:id', accessController.create); // открыть доступ
router.delete('/:id', accessController.delete);

export default router;
