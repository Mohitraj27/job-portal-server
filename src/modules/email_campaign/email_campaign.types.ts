
import  { Document } from 'mongoose';

export interface IEmail_campaign extends Document {
  campaignName: string;
  emailSubject: string;
  audience: string;
  message: string;
}
  