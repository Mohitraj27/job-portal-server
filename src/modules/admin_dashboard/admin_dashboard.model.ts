
import mongoose, { Schema } from 'mongoose';
import { IAdmin_dashboard } from './admin_dashboard.types';

const Admin_dashboardSchema: Schema<IAdmin_dashboard> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IAdmin_dashboard>('Admin_dashboard', Admin_dashboardSchema);
  