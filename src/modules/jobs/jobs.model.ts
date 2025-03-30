import mongoose, { Schema } from 'mongoose';
import {
    Currency,
  IJob,
  JobEmploymentType,
  JobExperienceLevel,
  JobModerationStatus,
  JobPriority,
  JobStatus,
} from './jobs.types';




const JobSchema: Schema<IJob> = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true, index: true },
  company: {
    name: { type: String },
    logoUrl: { type: String },
    website: { type: String },
  },
  category: { type:String,required: true },

  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String },
    streetAddress: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    remoteRestriction: { type: String },
  },
  employmentType: {
    type: String,
    enum: Object.values(JobEmploymentType),
    required: true,
  },
  industry: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: {
    level: {
      type: String,
      enum: Object.values(JobExperienceLevel),
      required: true,
    },
    years: {
      type: {
        min: { type: Number, required: true, min: 0 },
        max: { type: Number, required: true, max: 50 },
      },
    },
  },
  education: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: 'USD',
    },
  },
  numberOfOpenings: { type: Number, required: true, min: 1, default: 1 },
postedAt: { type: Date, default: () => new Date() },
  validTill: { type: Date, required: true },
  remote: { type: Boolean, default: false },
  benefits: { type: [String], default: [] },
  applicationLink: { type: String, required: true },
  createdBy: {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.ACTIVE,
  },
  priority: {
    type: String,
    enum: Object.values(JobPriority),
    default: JobPriority.NORMAL,
  },
  tags: { type: [String], default: [] },
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  moderationStatus: {
    type: String,
    enum: Object.values(JobModerationStatus),
    default: JobModerationStatus.PENDING,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IJob>('Job', JobSchema);
