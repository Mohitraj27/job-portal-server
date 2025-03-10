import mongoose, { Schema } from 'mongoose';
import { IAutomationEmployee } from './employee_automation.types';

const EmployeeAutomationSchema: Schema<IAutomationEmployee> = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    automationId: {
      type: Schema.Types.ObjectId,
      ref: 'Automation',
      required: true,
    },
     message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'INACTIVE'],
    },
  },
  { timestamps: true },
);

export const EmployeeAutomation = mongoose.model<IAutomationEmployee>(
  'EmployeeAutomation',
  EmployeeAutomationSchema,
);
