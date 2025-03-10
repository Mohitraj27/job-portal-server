
import { EmployeeAutomation } from './employee_automation.model';
import { IAutomationEmployee } from './employee_automation.types';

export const employee_automationService = {
  async createEmployee_automation(data: IAutomationEmployee) {
    return await EmployeeAutomation.create(data);
  },

  async getAllEmployee_automations(query: { employeeId?: string; automationId?: string; status?: string }) {
    const { employeeId, automationId, status } = query;
    const filterQuery: any = {};
    if (employeeId) filterQuery.employeeId = employeeId;
    if (automationId) filterQuery.automationId = automationId;
    if (status) filterQuery.status = status;
    return await EmployeeAutomation.find(filterQuery);
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
  