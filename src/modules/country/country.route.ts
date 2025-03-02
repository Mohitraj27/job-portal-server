
import { Router } from 'express';
import { countryController } from './country.controller';
import { validateCountry } from './country.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const countryRouter = Router();
countryRouter.param('id', validateObjectId);
countryRouter.use(responseMiddleware);
countryRouter.post('/createcountry', validateCountry, countryController.createCountry);
countryRouter.get('/countrylist', countryController.getAllCountrys);
countryRouter.get('/getcountry/:id', countryController.getSingleCountry);
countryRouter.put('/updatecountry/:id', validateCountry, countryController.updateCountry);
countryRouter.delete('/deletecountry/:id', countryController.deleteCountry);

export default countryRouter;
  