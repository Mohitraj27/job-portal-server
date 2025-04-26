import mongoose, { Document } from 'mongoose';
export interface dashboard extends Document {
    userId: mongoose.Types.ObjectId;
    totalJobPosting: number;
    totalActiveApplicants: number;
}