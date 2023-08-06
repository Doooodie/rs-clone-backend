import { Router } from 'express';
import UserController from '../controllers/user-controller.js';
import authMiddleWare from '../middleware/authMiddleware.js';

const router = Router();

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.get('/auth', authMiddleWare, UserController.check);

export default router;
