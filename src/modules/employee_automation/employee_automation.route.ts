
import { Router } from 'express';
import { employee_automationController } from './employee_automation.controller';
import { validateEmployee_automation } from './employee_automation.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const employeeAutomationRouter = Router();
employeeAutomationRouter.param('id', validateObjectId);
employeeAutomationRouter.use(responseMiddleware);
employeeAutomationRouter.post('/create-employee-automation', validateEmployee_automation, employee_automationController.createEmployee_automation);
employeeAutomationRouter.get('/employee-automation-list', employee_automationController.getAllEmployee_automations);
employeeAutomationRouter.get('/get-employee-automation/:id', employee_automationController.getSingleEmployee_automation);
employeeAutomationRouter.put('/update-employee-automation/:id', validateEmployee_automation, employee_automationController.updateEmployee_automation);
employeeAutomationRouter.delete('/delete-employee-automation/:id', employee_automationController.deleteEmployee_automation);

export default employeeAutomationRouter;
  