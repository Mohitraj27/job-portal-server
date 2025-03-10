
import { Companies } from './employer.model';
import { ICompany } from './employer.types';

export const employerService = {
  async createEmployer(data: ICompany) {
    return await Companies.create(data);
  },

  async getAllEmployers(query: any) {
    return await Companies.find(query);
  },

  async getSingleEmployer(id: string) {
    return await Companies.findById(id);
  },

  async updateEmployer(id: string, data: Partial<ICompany>) {
    return await Companies.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteEmployer(id: string) {
    return await Companies.findByIdAndDelete(id);
  }
};
  