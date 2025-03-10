import   mongoose, { Document } from 'mongoose';
export type Status = 'ACTIVE' | 'INACTIVE';
export interface IAutomationEmployee extends Document {
  employeeId: mongoose.Schema.Types.ObjectId;
  automationId: mongoose.Schema.Types.ObjectId;
  status: Status;
  message: string;
}
