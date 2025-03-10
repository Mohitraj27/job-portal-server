import mongoose, { Schema } from 'mongoose';
import { ICity, ICountries, IState } from './location.types';

const CountrySchema: Schema<ICountries> = new Schema(
  {
    name: { type: String, required: true },
    countryId: { type: Number, required: true },
  },
  { timestamps: true },
);

const StateSchema: Schema<IState> = new Schema(
  {
    name: { type: String, required: true },
    countryId: { type: Number, required: true },
  },
  { timestamps: true },
);

const CitySchema: Schema<ICity> = new Schema(
  {
    name: { type: String, required: true },
    stateId: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Countries = mongoose.model<ICountries>('Country', CountrySchema);
export const States = mongoose.model<IState>('State', StateSchema);
export const Cities = mongoose.model<ICity>('City', CitySchema);
