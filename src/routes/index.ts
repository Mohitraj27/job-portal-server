import jobsRouter from '@modules/jobs/jobs.routes';
import userRouter from '@modules/user/user.routes';
import appliedCandidatesRouter from '@modules/applied-candidates/applied-candidates.routes';
import automationsRouter from '@modules/automations/automations.route';
import { Router } from 'express';
import employeeAutomationRouter from '@modules/employee_automation/employee_automation.route';
import locationRouter from '@modules/location/location.route';
import messagesRouter from '@modules/messages/messages.routes';

const router = Router();

router.use('/users', userRouter);
router.use('/jobs', jobsRouter);
router.use('/applied-candidates',appliedCandidatesRouter);
router.use('/automations',automationsRouter);
router.use('/employee-automation', employeeAutomationRouter);
router.use('/locations',locationRouter);

router.use('/messages', messagesRouter); 
export default router;
