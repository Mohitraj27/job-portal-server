import mongoose, { Schema } from 'mongoose';
import { IAppliedCandidate, ApplicationStatus } from './applied-candidates.types';
// import { IAppliedCandidate, ApplicationStatus } from './appliedCandidates.types';

const AppliedCandidateSchema: Schema<IAppliedCandidate | any> = new Schema({
  jobId: {
    type: mongoose.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  candidateId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  appliedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.APPLIED,
  },
  isShortlisted: { type: Boolean, default: false },
  shortlistedDate: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create indexes for common queries
AppliedCandidateSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
AppliedCandidateSchema.index({ status: 1 });
AppliedCandidateSchema.index({ isShortlisted: 1 });

export default mongoose.model<IAppliedCandidate>('AppliedCandidate', AppliedCandidateSchema);