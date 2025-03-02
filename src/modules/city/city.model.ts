
import mongoose, { Schema } from 'mongoose';
import { ICity } from './city.types';

const CitySchema: Schema<ICity> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ICity>('City', CitySchema);
  