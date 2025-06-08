
import { Router } from 'express';
import { locationController } from './location.controller';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const locationRouter = Router();
locationRouter.use(responseMiddleware);

locationRouter.get('/countries-list', locationController.getCountries);
locationRouter.get('/states-list', locationController.getStates);
locationRouter.get('/cities-list', locationController.getCities);
locationRouter.get('/list', locationController.getAllLocations);

export default locationRouter;
