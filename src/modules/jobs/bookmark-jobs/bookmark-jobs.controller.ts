import { NextFunction, Request, Response } from 'express';
import { jobBookmarkedService } from './bookmark-jobs.service';
import httpStatus from '@utils/httpStatus';
import { BOOKMARK_JOB_MESSAGES } from './bookmark-jobs.enum';

export const bookmarkJobsController = {
  async createJobBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobBookmarkedService.createJobBookmarkService(req.body as any);
      res.sendResponse(httpStatus.CREATED, job, BOOKMARK_JOB_MESSAGES.JOB_BOOKMARKED_SUCCESS);
    } catch (error) {
      next(error);
    }
  },
  
  async getallBookmarkJobsforJobSeeker(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.query;
   
    try {
      const bookmarkedJobs = await jobBookmarkedService.getallBookmarkJobsforJobSeekerService(userId as string);
      res.sendResponse(httpStatus.OK, bookmarkedJobs, BOOKMARK_JOB_MESSAGES.JOB_BOOKMARKED_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async removeJobBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const bookmarkedJobs = await jobBookmarkedService.removeJobBookmarkService(req.body as any);
      res.sendResponse(httpStatus.OK, bookmarkedJobs, BOOKMARK_JOB_MESSAGES.JOB_UNBOOKMARKED);
    } catch (error) {
      next(error);
    }
  },
  
};