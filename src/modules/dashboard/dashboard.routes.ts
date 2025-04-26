import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import {validateDashboardSchema } from './dashboard.validation';
const dashboardRouter = Router();

dashboardRouter.use(responseMiddleware);

dashboardRouter.route('/totaljobpostingcount').get(validateDashboardSchema, dashboardController.countJobPostings);
dashboardRouter.route('/totalcount-active-applicants').get(validateDashboardSchema, dashboardController.countActiveApplicants);
dashboardRouter.route('/joblist-postings').get(validateDashboardSchema, dashboardController.jobpostlisting);
export default dashboardRouter;