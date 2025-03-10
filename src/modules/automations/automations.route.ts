
import { Router } from 'express';
import { automationsController } from './automations.controller';
import { validateAutomations } from './automations.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const automationsRouter = Router();
automationsRouter.param('id', validateObjectId);
automationsRouter.use(responseMiddleware);
automationsRouter.post('/create-automations', validateAutomations, automationsController.createAutomations);
automationsRouter.get('/automations-list', automationsController.getAllAutomationss);
automationsRouter.get('/get-automations/:id', automationsController.getSingleAutomations);
automationsRouter.put('/update-automations/:id', validateAutomations, automationsController.updateAutomations);
automationsRouter.delete('/delete-automations/:id', automationsController.deleteAutomations);

export default automationsRouter;
  