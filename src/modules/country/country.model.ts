
import mongoose, { Schema } from 'mongoose';
import { ICountry } from './country.types';

const CountrySchema: Schema<ICountry> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ICountry>('Country', CountrySchema);
  