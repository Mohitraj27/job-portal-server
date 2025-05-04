import mongoose, { Schema } from 'mongoose';
import { Frequency } from './job-alert.types';

const jobAlertSchema: Schema = new Schema({
  title: { type: String, required: true, index: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  frequency: { type: String, enum: Object.values(Frequency), default: 'daily' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('job-alerts', jobAlertSchema);
