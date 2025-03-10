import mongoose, { Document } from 'mongoose';

export interface ICountries extends Document {
  name: string;
  countryId: mongoose.Schema.Types.ObjectId;
}
export interface IState {
  name: string;
  countryId: mongoose.Schema.Types.ObjectId;
}

export interface ICity {
  name: string;
  stateId: mongoose.Schema.Types.ObjectId;
}