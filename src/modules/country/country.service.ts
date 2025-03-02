
import countryModel from './country.model';
import { ICountry } from './country.types';

export const countryService = {
  async createCountry(data: ICountry) {
    return await countryModel.create(data);
  },

  async getAllCountrys(query: any) {
    return await countryModel.find(query);
  },

  async getSingleCountry(id: string) {
    return await countryModel.findById(id);
  },

  async updateCountry(id: string, data: Partial<ICountry>) {
    return await countryModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCountry(id: string) {
    return await countryModel.findByIdAndDelete(id);
  }
};
  