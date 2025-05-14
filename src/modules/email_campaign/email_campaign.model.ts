import mongoose, { Schema } from 'mongoose';
import { IEmail_campaign } from './email_campaign.types';

const Email_campaignSchema: Schema<IEmail_campaign> = new Schema(
  {
    campaignName: { type: String, required: true },
    emailSubject: { type: String, required: true },
    audience: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IEmail_campaign>(
  'email_campaign',
  Email_campaignSchema,
);
