import jobsRouter from '@modules/jobs/jobs.routes';
import userRouter from '@modules/user/user.routes';
import appliedCandidatesRouter from '@modules/applied-candidates/applied-candidates.routes';
import messagesRouter from '@modules/messages/messages.routes';
import { Router } from 'express';

const router = Router();

router.use('/users', userRouter);
router.use('/jobs', jobsRouter);
router.use('/applied-candidates',appliedCandidatesRouter);
router.use('/messages', messagesRouter); 
export default router;
