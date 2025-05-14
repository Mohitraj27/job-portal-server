
import { Router } from 'express';
import { admin_dashboardController } from './admin_dashboard.controller';
import { validateAdmin_dashboard } from './admin_dashboard.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const admin_dashboardRouter = Router();
admin_dashboardRouter.param('id', validateObjectId);
admin_dashboardRouter.use(responseMiddleware);
admin_dashboardRouter.post('/create-admin_dashboard', validateAdmin_dashboard, admin_dashboardController.createAdmin_dashboard);
admin_dashboardRouter.get('/admin_dashboard-list', admin_dashboardController.getAllAdmin_dashboards);
admin_dashboardRouter.get('/get-admin_dashboard/:id', admin_dashboardController.getSingleAdmin_dashboard);
admin_dashboardRouter.put('/update-admin_dashboard/:id', validateAdmin_dashboard, admin_dashboardController.updateAdmin_dashboard);
admin_dashboardRouter.delete('/delete-admin_dashboard/:id', admin_dashboardController.deleteAdmin_dashboard);
admin_dashboardRouter.get('/cards-count', admin_dashboardController.getAdmin_dashboardCardsCount);
admin_dashboardRouter.get('/users-registration-trends', admin_dashboardController.getUserRegistrationTrends);
admin_dashboardRouter.get('/jobs-applications-trends', admin_dashboardController.getJobsApplicationsTrends);
admin_dashboardRouter.get('/job-seeker-demographics', admin_dashboardController.getJobSeekerDemographics);
admin_dashboardRouter.get('/job-seeker-activity', admin_dashboardController.getJobSeekerActivity);
export default admin_dashboardRouter;
  