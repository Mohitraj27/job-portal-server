
import { Router } from 'express';
import { content_managementController } from './content_management.controller';
import { validateContent_management } from './content_management.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const content_managementRouter = Router();
content_managementRouter.param('id', validateObjectId);
content_managementRouter.use(responseMiddleware);
content_managementRouter.post('/create-content_management', validateContent_management, content_managementController.createContent_management);
content_managementRouter.get('/content_management-list', content_managementController.getAllContent_managements);
content_managementRouter.get('/get-content_management/:id', content_managementController.getSingleContent_management);
content_managementRouter.put('/update-content_management/:id', validateContent_management, content_managementController.updateContent_management);
content_managementRouter.delete('/delete-content_management/:id', content_managementController.deleteContent_management);
content_managementRouter.get('/content_management-status-count', content_managementController.getContent_managementByStatus);
content_managementRouter.get('/get-topfive-contents', content_managementController.getTopFiveContents);
export default content_managementRouter;
  