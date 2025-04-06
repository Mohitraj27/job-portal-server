import { Router } from 'express';
import { talentScoutController } from './talent-scout.controller';
import { responseMiddleware } from '@middlewares/responseMiddleware';
import { validateTalentScoutMiddleware } from './talent-scout.validation';

const talentScoutRouter = Router();
talentScoutRouter.use(responseMiddleware);
talentScoutRouter.get('/talent-scout-details',validateTalentScoutMiddleware,  talentScoutController.getTalentScoutDetails);

export default talentScoutRouter;