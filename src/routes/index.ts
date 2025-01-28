import jobsRouter from '@modules/jobs/jobs.routes';
import userRouter from '@modules/user/user.routes';
import { Router } from 'express';

const router = Router();

router.use('/users', userRouter);
router.use('/jobs', jobsRouter);

export default router;
