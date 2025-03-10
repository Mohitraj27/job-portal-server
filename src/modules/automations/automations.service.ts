
import { Automation } from './automations.model';
import { IAutomation } from './automations.types';

export const automationsService = {
  async createAutomations(data: IAutomation) {
    return await Automation.create(data);
  },

  async getAllAutomationss(query: any) {
    return await Automation.find(query);
  },

  async getSingleAutomations(id: string) {
    return await Automation.findById(id);
  },

  async updateAutomations(id: string, data: Partial<IAutomation>) {
    return await Automation.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteAutomations(id: string) {
    return await Automation.findByIdAndDelete(id);
  },
};
  