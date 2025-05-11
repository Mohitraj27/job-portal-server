
import mongoose, { Document } from 'mongoose';

export interface IAdmin_dashboard extends Document {
  name: string;
  description: string;
}
  