import { responseMiddleware } from "@middlewares/responseMiddleware";
import { Router } from "express";
import { jobController } from "./jobs.controller";
import { validateDeleteJobMiddleware } from "./jobs.validation";
import { validateObjectId } from "@middlewares/validateobjectid.middleware";


const jobsRouter = Router();
jobsRouter.param('id', validateObjectId);

jobsRouter.use(responseMiddleware);

jobsRouter.route('/create-job').post(jobController.createJob);
jobsRouter.route('/get-jobs').get(jobController.getAllJobs);
jobsRouter.route('/get-job/:id').get(jobController.getAllJobs);
jobsRouter.route('/update-job/:id').put(jobController.updateJob);
jobsRouter
  .route('/delete-job/:id')
  .delete(validateDeleteJobMiddleware,jobController.deleteJob);

export default jobsRouter;
