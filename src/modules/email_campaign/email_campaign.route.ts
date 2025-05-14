
import { Router } from 'express';
import { email_campaignController } from './email_campaign.controller';
import { validateEmail_campaign } from './email_campaign.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const email_campaignRouter = Router();
email_campaignRouter.param('id', validateObjectId);
email_campaignRouter.use(responseMiddleware);
email_campaignRouter.post('/create-email_campaign', validateEmail_campaign, email_campaignController.createEmail_campaign);
email_campaignRouter.get('/email_campaign-list', email_campaignController.getAllEmail_campaigns);
email_campaignRouter.get('/get-email_campaign/:id', email_campaignController.getSingleEmail_campaign);
email_campaignRouter.put('/update-email_campaign/:id', validateEmail_campaign, email_campaignController.updateEmail_campaign);
email_campaignRouter.delete('/delete-email_campaign/:id', email_campaignController.deleteEmail_campaign);

export default email_campaignRouter;
  