import { Router } from 'express';
import { talentScoutController } from './talent-scout.controller';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const talentScoutRouter = Router();
talentScoutRouter.use(responseMiddleware);
talentScoutRouter.get('/talent-scout-details',  talentScoutController.getTalentScoutDetails);
talentScoutRouter.get('/advance-talent-scout-details', talentScoutController.getAdvanceTalentScoutDetails);
talentScoutRouter
  .route('/talent-scout-jobs/:id')
  .get(talentScoutController.getTalentScoutJobs);  
export default talentScoutRouter;