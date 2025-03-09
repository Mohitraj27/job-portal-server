import mongoose, { Document } from 'mongoose';

export interface IAppliedCandidate extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateJobTitle: string;
  candidateEmail: string;
  candidatePhone?: string;
  location: {
    city?: string;
    state?: string;
    country: string;
  };
  resumeUrl: string;
  coverLetter?: string;
  appliedDate: Date;
  status: ApplicationStatus;
  isShortlisted: boolean;
  shortlistedDate?: Date;
  notes?: string;
  skills: string[];
  experience?: number;
  education?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWED = 'REVIEWED',
  INTERVIEWING = 'INTERVIEWING',
  REJECTED = 'REJECTED',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  WITHDRAWN = 'WITHDRAWN',
  SHORTLISTED= 'SHORTLISTED',
}

export interface AppliedCandidateQuery {
  jobId?: string;
  candidateId?: string;
  status?: ApplicationStatus;
  isShortlisted?: boolean;
  appliedAfter?: Date;
  appliedBefore?: Date;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}