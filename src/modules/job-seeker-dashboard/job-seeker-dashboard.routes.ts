import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { jobSeekerController } from './job-seeker-dashboard.controller';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
const jobSeekerdashboardRouter = Router();

jobSeekerdashboardRouter.param('id', validateObjectId);
jobSeekerdashboardRouter.use(responseMiddleware);
jobSeekerdashboardRouter.route('/applied-jobscount/:userId').get(jobSeekerController.countAppliedJobs);
jobSeekerdashboardRouter.route('/shortlisted-jobscount/:userId').get(jobSeekerController.shortlistedJobsCount);
jobSeekerdashboardRouter.route('/applied-jobs-jobseeker/:userId').get(jobSeekerController.appliedJobsforJobSeeker);
jobSeekerdashboardRouter.route('/recommended-jobs/:userId').get(jobSeekerController.recommendedJobsbasedforJobSeeker);
jobSeekerdashboardRouter.route('/job-alerts-count/:userId').get(jobSeekerController.jobAlertsCount);
export default jobSeekerdashboardRouter;