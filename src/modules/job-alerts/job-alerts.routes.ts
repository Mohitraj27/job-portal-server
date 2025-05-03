import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { jobAlertsController } from './job-alerts.controller';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { validateJobAlertsSchema } from './job-alert.validation';
const createJobAlertsforJobSeekersRouter = Router();

createJobAlertsforJobSeekersRouter.param('id', validateObjectId);
createJobAlertsforJobSeekersRouter.use(responseMiddleware);
createJobAlertsforJobSeekersRouter
  .route('/create-job-alerts')
  .post(validateJobAlertsSchema, jobAlertsController.createJobAlerts);
createJobAlertsforJobSeekersRouter
  .route('/get-job-alerts/:userId')
  .get(jobAlertsController.getAllJobAlerts);
createJobAlertsforJobSeekersRouter.route('/delete-job-alerts/:id').delete(jobAlertsController.deleteJobAlerts);
createJobAlertsforJobSeekersRouter.route('/update-job-alerts/:id').put(jobAlertsController.updateJobAlerts);
export default createJobAlertsforJobSeekersRouter;
