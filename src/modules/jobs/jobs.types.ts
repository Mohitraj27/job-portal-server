import mongoose, { Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: {
    name: string;
    logoUrl?: string;
    website?: string;
  };
  location: {
    city?: string;
    state?: string;
    country: string;
    zipCode?: string;
    streetAddress?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    remoteRestriction?: string;
  };
  employmentType: JobEmploymentType;
  industry: string;
  skills: string[];
  experience: {
    level: JobExperienceLevel;
    years: number;
  };
  education: string[];
  languages: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  numberOfOpenings: number;
  postedAt: Date;
  validTill: Date;
  remote: boolean;
  benefits: string[];
  applicationLink: string;
  createdBy: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  status: JobStatus;
  priority: JobPriority;
  tags: string[];
  views: number;
  applicationsCount: number;
  savedCount: number;
  moderationStatus: JobModerationStatus;
  isVerified: boolean;
}

export enum JobEmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobExperienceLevel {
  JUNIOR = 'JUNIOR',
  MID_LEVEL = 'MID_LEVEL',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum JobPriority {
  NORMAL = 'NORMAL',
  FEATURED = 'FEATURED',
  SPONSORED = 'SPONSORED',
}

export enum JobModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}