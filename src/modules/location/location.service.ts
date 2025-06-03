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
  },
  async getAllLocations(query:{search?: string}) {
    const { search } = query;
    const data = await Promise.all([
      Countries.find({ name: { $regex: search || '', $options: 'i' } }),
      States.find({ name: { $regex: search || '', $options: 'i' } }),
      Cities.find({ name: { $regex: search || '', $options: 'i' } }),
    ]);

    return [...data[0], ...data[1], ...data[2]];
  }
};
