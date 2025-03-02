
import mongoose, { Schema } from 'mongoose';
import { IState } from './state.types';

const StateSchema: Schema<IState> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IState>('State', StateSchema);
  