
import { Router } from 'express';
import { cityController } from './city.controller';
import { validateCity } from './city.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const cityRouter = Router();
cityRouter.param('id', validateObjectId);
cityRouter.use(responseMiddleware);
cityRouter.post('/create-city', validateCity, cityController.createCity);
cityRouter.get('/city-list', cityController.getAllCitys);
cityRouter.get('/get-city/:id', cityController.getSingleCity);
cityRouter.put('/update-city/:id', validateCity, cityController.updateCity);
cityRouter.delete('/delete-city/:id', cityController.deleteCity);

export default cityRouter;
  