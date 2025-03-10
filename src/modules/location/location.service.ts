import { Cities, Countries, States } from './location.model';

export const locationService = {
  async getCountries() {
    return await Countries.find({});
  },

  async getStates(query: { countryId?: string }) {
    const { countryId } = query;
    return await States.find(countryId ? { countryId } : {});
  },

  async getCities(query: { stateId?: string }) {
    const { stateId } = query;
    return await Cities.find(stateId ? { stateId } : {});
  }
};
