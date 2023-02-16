import Router from 'express';
import AccessController from '../controllers/access-controller.js';

const router = new Router();

router.post('/:id', AccessController.create);
router.delete('/:id', AccessController.delete);

export default router;
