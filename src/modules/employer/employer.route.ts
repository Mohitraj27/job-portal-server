
import { Router } from 'express';
import { employerController } from './employer.controller';
import { validateEmployer } from './employer.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const employerRouter = Router();
employerRouter.param('id', validateObjectId);
employerRouter.use(responseMiddleware);
employerRouter.post('/create-employer', validateEmployer, employerController.createEmployer);
employerRouter.get('/employer-list', employerController.getAllEmployers);
employerRouter.get('/get-employer/:id', employerController.getSingleEmployer);
employerRouter.put('/update-employer/:id', validateEmployer, employerController.updateEmployer);
employerRouter.delete('/delete-employer/:id', employerController.deleteEmployer);

export default employerRouter;
  