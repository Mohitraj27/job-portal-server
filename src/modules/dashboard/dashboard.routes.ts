import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
const dashboardRouter = Router();

dashboardRouter.param('id', validateObjectId);
dashboardRouter.use(responseMiddleware);
dashboardRouter.route('/totaljobpostingcount/:userId').get(dashboardController.countJobPostings);
dashboardRouter.route('/totalcount-active-applicants/:userId').get(dashboardController.countActiveApplicants);
dashboardRouter.route('/joblist-postings/:userId').get(dashboardController.jobpostlisting);
dashboardRouter.route('/job-performance/total-applicants/:userId').get(dashboardController.totalApplicants);
dashboardRouter.route('/job-Performance/shortlisted/:userId').get(dashboardController.totalshortlistedcandidates);
dashboardRouter.route('/job-performance/totalviewsCountforJobs/:userId').get(dashboardController.totalViewsCountforJob);
dashboardRouter.route('/applicant-trends/:userId').get(dashboardController.applicantTrends);
dashboardRouter.route('/job-expiry/:userId').get(dashboardController.jobExpirycount);
dashboardRouter.route('/bookmarkcount/:userId').get(dashboardController.totalbookmarkCount);
export default dashboardRouter;