import { Router } from 'express';

import userRouter from './user-router.js';
import fileRouter from './file-router.js';

const router = Router();

router.use('/user', userRouter);
router.use('/file', fileRouter);

export default router;
