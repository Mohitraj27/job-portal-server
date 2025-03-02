
import cityModel from './city.model';
import { ICity } from './city.types';

export const cityService = {
  async createCity(data: ICity) {
    return await cityModel.create(data);
  },

  async getAllCitys(query: any) {
    return await cityModel.find(query);
  },

  async getSingleCity(id: string) {
    return await cityModel.findById(id);
  },

  async updateCity(id: string, data: Partial<ICity>) {
    return await cityModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCity(id: string) {
    return await cityModel.findByIdAndDelete(id);
  }
};
  