import Router from 'express';
import UserController from '../controllers/user-controller.js';

const router = new Router();
const userController = new UserController();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', userController.check);

export default router;
