import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { bookmarkJobsController } from './bookmark-jobs.controller';
import { validateBookmarkJobMiddleware, validateGetBookarkJobMiddleware } from './bookmark-jobs.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';

const bookmarkJobsRouter = Router();
bookmarkJobsRouter.param('id', validateObjectId);

bookmarkJobsRouter.use(responseMiddleware);

bookmarkJobsRouter.route('/create-job-bookmark').post(validateBookmarkJobMiddleware, bookmarkJobsController.createJobBookmark);
bookmarkJobsRouter.route('/get-all-bookmark-jobs').get(validateGetBookarkJobMiddleware, bookmarkJobsController.getallBookmarkJobsforJobSeeker);
bookmarkJobsRouter.route('/remove-job-bookmark').post(validateBookmarkJobMiddleware,bookmarkJobsController.removeJobBookmark);
export default bookmarkJobsRouter;