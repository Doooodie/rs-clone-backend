import Router from 'express';

import userRouter from './user-router.js';
import fileRouter from './file-router.js';
import accessRouter from './access-router.js';
import commentRouter from './comment-router.js';

const router = new Router();

router.use('/user', userRouter);
router.use('/file', fileRouter);
router.use('/access', accessRouter);
router.use('/comment', commentRouter);

export default router;
