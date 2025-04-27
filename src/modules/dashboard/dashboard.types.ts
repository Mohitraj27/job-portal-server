import mongoose, { Document } from 'mongoose';
export interface dashboard extends Document {
    userId: string;
    totalJobPosting: number;
    totalActiveApplicants: number;
}