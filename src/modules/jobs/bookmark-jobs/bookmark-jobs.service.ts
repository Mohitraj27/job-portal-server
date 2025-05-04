import JobsBookamarked from './bookmark-jobs.model';
import JobModel from '@modules/jobs/jobs.model';
import {JOB_MESSAGES} from '@modules/jobs/jobs.enum';
import httpStatus from '@utils/httpStatus';
import { throwError } from '@utils/throwError';
import mongoose from 'mongoose';
import {BOOKMARK_JOB_MESSAGES} from './bookmark-jobs.enum';

export const jobBookmarkedService = {
  async createJobBookmarkService(data: any) {
    const { userId, jobId } = data;
    const job = await JobModel.findById(jobId);
    if (!job) {
      return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
    }
    let userBookmarks = await JobsBookamarked.findOne({ userId }).exec() as any | null;
    
    if (userBookmarks) {
      const jobIdStr = jobId.toString();
      const hasJob = userBookmarks.jobIds.some((id: { toString: () => any; }) => id.toString() === jobIdStr);
      if (!hasJob) {
        userBookmarks.jobIds.push(new mongoose.Types.ObjectId(jobId));
        userBookmarks.updatedAt = new Date();
        await userBookmarks.save();
      }
      return userBookmarks;
    } else {
      // Create new bookmark document for user
      userBookmarks = await JobsBookamarked.create({
        userId,
        jobIds: [new mongoose.Types.ObjectId(jobId)],
      });
      return userBookmarks;
    }
  },

  async getallBookmarkJobsforJobSeekerService(userId: string){
    const userBookmarks = await JobsBookamarked.findOne({ userId }).populate('jobIds').lean();
    if (!userBookmarks) {
      return { bookmarkedJobs: [], count: 0 };
    }
    const bookmarkedJobCount = Array.isArray(userBookmarks?.jobIds) ? userBookmarks.jobIds.length : 0;
    return { 
      bookmarkedJobs: userBookmarks.jobIds as any[], 
      totalbookmarkedJobCount: bookmarkedJobCount
    };
  },
  async removeJobBookmarkService(data: any) {
    const { userId, jobId } = data;
    
    const job = await JobModel.findById(jobId);
    if (!job) {
      return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
    }
    
    const userBookmarks = await JobsBookamarked.findOne({ userId }).exec() as any | null;
    
    if (!userBookmarks) {
      return throwError(httpStatus.NOT_FOUND, BOOKMARK_JOB_MESSAGES.JOB_BOOKMARK_NOT_FOUND);
    }
    const jobIdStr = jobId.toString();
    const hasJob = userBookmarks.jobIds.some((id: { toString: () => any; }) => id.toString() === jobIdStr);
    if (!hasJob) {
      return throwError(httpStatus.NOT_FOUND, BOOKMARK_JOB_MESSAGES.JOB_BOOKMARK_NOT_FOUND);
    }
    userBookmarks.jobIds = userBookmarks.jobIds.filter(
      (id: { toString: () => any; }) => id.toString() !== jobIdStr
    );
    userBookmarks.updatedAt = new Date();
    await userBookmarks.save();
    return userBookmarks;
  },
    
   
};