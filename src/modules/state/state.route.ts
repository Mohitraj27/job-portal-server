
import { Router } from 'express';
import { stateController } from './state.controller';
import { validateState } from './state.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const stateRouter = Router();
stateRouter.param('id', validateObjectId);
stateRouter.use(responseMiddleware);
stateRouter.post('/create-state', validateState, stateController.createState);
stateRouter.get('/state-list', stateController.getAllStates);
stateRouter.get('/get-state/:id', stateController.getSingleState);
stateRouter.put('/update-state/:id', validateState, stateController.updateState);
stateRouter.delete('/delete-state/:id', stateController.deleteState);

export default stateRouter;
  