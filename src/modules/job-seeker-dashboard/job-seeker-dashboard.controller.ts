import { NextFunction,  Request, Response } from 'express';
import { jobseekerDashboardService } from '@modules/job-seeker-dashboard/job-seeker-dashboard.service';
import httpStatus from '@utils/httpStatus';
import { JOB_SEEKER_DASHBOARD_MESSAGES } from '@modules/job-seeker-dashboard/job-seeker-dashboard.enum';
export const jobSeekerController = {
  async countAppliedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const countAppliedJob = await jobseekerDashboardService.countAppliedJob(req.params as any);
      res.sendResponse(httpStatus.OK, countAppliedJob, JOB_SEEKER_DASHBOARD_MESSAGES.JOB_SEEKER_APPLIED_JOBS_DATA_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async shortlistedJobsCount(req: Request, res: Response, next: NextFunction) {
    try {
      const shortlistedJobsCount = await jobseekerDashboardService.countShortlistedJob(req.params as any);
      res.sendResponse(httpStatus.OK, shortlistedJobsCount, JOB_SEEKER_DASHBOARD_MESSAGES.SHORTLISTED_JOBS_COUNT_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async appliedJobsforJobSeeker(req: Request, res: Response, next: NextFunction) {
    try {
      const appliedJobsforJobSeeker = await jobseekerDashboardService.appliedJobsforJobSeeker(req.params as any);
      res.sendResponse(httpStatus.OK, appliedJobsforJobSeeker, JOB_SEEKER_DASHBOARD_MESSAGES.JOB_SEEKER_APPLIED_JOBS_DATA_FETCHED);
    } catch (error) {
      next(error);
    }
  },
};