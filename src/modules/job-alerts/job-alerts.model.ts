import mongoose, { Schema } from 'mongoose';

const jobAlertSchema: Schema = new Schema({
  title: { type: String, required: true, index: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('job-alerts', jobAlertSchema);
