import mongoose, { Schema } from 'mongoose';
import { IAppliedCandidate, ApplicationStatus } from './applied-candidates.types';
// import { IAppliedCandidate, ApplicationStatus } from './appliedCandidates.types';

const AppliedCandidateSchema: Schema<IAppliedCandidate | any> = new Schema({
  jobId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Job', 
    required: true,
    index: true 
  },
  candidateId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  candidateName: { type: String, required: true },
  candidateJobTitle: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidatePhone: { type: String },
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true },
  },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: Object.values(ApplicationStatus), 
    default: ApplicationStatus.APPLIED 
  },
  isShortlisted: { type: Boolean, default: false },
  shortlistedDate: { type: Date },
  notes: { type: String },
  skills: { type: [String], default: [] },
  experience: { type: Number },
  education: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for common queries
AppliedCandidateSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
AppliedCandidateSchema.index({ status: 1 });
AppliedCandidateSchema.index({ isShortlisted: 1 });

export default mongoose.model<IAppliedCandidate>('AppliedCandidate', AppliedCandidateSchema);