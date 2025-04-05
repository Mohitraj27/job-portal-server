import  { Document } from "mongoose";

export enum PricingType {
  PAID = 'PAID',
  FREE = 'FREE',
  COMING_SOON = 'COMING_SOON',
}

export enum AutomationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IAutomation extends Document {
  title: { type: StringConstructor; required: true };
  description: { type: StringConstructor; required: true };
  includedWith: { type: PricingType;  };
  status: { type: AutomationStatus; required: true };
}
