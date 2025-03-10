import mongoose, { Schema } from 'mongoose';
import { ICompany } from './employer.types';

const CompanySchema: Schema = new Schema(
  {
    logo: { type: String },
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    website: { type: String },
    establishedDate: { type: Date },
    teamSize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    industry: {
      type: String,
    },
    allowInSearch: { type: Boolean, default: true },
    about: { type: String },
    benefits: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
  
    country: { type: String },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      linkedIn: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true },
);

export const Companies = mongoose.model<ICompany>('Company', CompanySchema);
