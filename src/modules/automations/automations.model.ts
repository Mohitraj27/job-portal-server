import mongoose, { Schema } from 'mongoose';
import {
  AutomationStatus,
  IAutomation,
  PricingType,
  
} from './automations.types';

const AutomationSchema: Schema<IAutomation> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    includedWith: {
      type: String,
      required: true,
      enum: [PricingType.PAID, PricingType.FREE, PricingType.COMING_SOON],
    },
    status: {
      type: String,
      required: true,
      enum: [AutomationStatus.ACTIVE, AutomationStatus.INACTIVE],
    },
  },
  { timestamps: true },
);


export const Automation = mongoose.model<IAutomation>(
  'Automation',
  AutomationSchema,
);


