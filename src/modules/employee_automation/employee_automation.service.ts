
import { throwError } from '@utils/throwError';
import { EmployeeAutomation } from './employee_automation.model';
import { IAutomationEmployee } from './employee_automation.types';
import httpStatus from '@utils/httpStatus';
import { EMPLOYEE_AUTOMATION_MESSAGES } from './employee_automation.enum';

export const employee_automationService = {
  async createEmployee_automation(data: IAutomationEmployee) {
    const existingRecord = await EmployeeAutomation.findOne({ 
      employeeId: data.employeeId, 
      automationId: data.automationId 
    });

    if (existingRecord) {
        return throwError(
          httpStatus.CONFLICT,
          EMPLOYEE_AUTOMATION_MESSAGES.ALREADY_EXISTS,
        );
    }

    return await EmployeeAutomation.create(data);
  },

  async getAllEmployee_automations(query: { employeeId?: string; automationId?: string; status?: string }) {
    const { employeeId, automationId, status } = query;
    const filterQuery: any = {};
    if (employeeId) filterQuery.employeeId = employeeId;
    if (automationId) filterQuery.automationId = automationId;
    if (status) filterQuery.status = status;
    return await EmployeeAutomation.find(filterQuery).populate('automationId', 'title description includedWith status'); 
  },

  async getSingleEmployee_automation(id: string) {
    return await EmployeeAutomation.findById(id);
  },

  async updateEmployee_automation(
    id: string,
    data: Partial<IAutomationEmployee>,
  ) {
    return await EmployeeAutomation.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteEmployee_automation(id: string) {
    return await EmployeeAutomation.findByIdAndDelete(id);
  },
};
  