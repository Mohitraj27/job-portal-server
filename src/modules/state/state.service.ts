
import stateModel from './state.model';
import { IState } from './state.types';

export const stateService = {
  async createState(data: IState) {
    return await stateModel.create(data);
  },

  async getAllStates(query: any) {
    return await stateModel.find(query);
  },

  async getSingleState(id: string) {
    return await stateModel.findById(id);
  },

  async updateState(id: string, data: Partial<IState>) {
    return await stateModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteState(id: string) {
    return await stateModel.findByIdAndDelete(id);
  }
};
  