import { NextFunction, Request, Response } from 'express';
import { jobService } from './jobs.service';
import httpStatus from '@utils/httpStatus';
import { JOB_MESSAGES } from './jobs.enum';
import { throwError } from '@utils/throwError';

export const jobController = {
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.createJob(req.body);
      res.sendResponse(httpStatus.CREATED, job, JOB_MESSAGES.JOB_CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.getAllJobs(req.query);
      res.sendResponse(httpStatus.OK, jobs, JOB_MESSAGES.JOBS_FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.getSingleJob(req.params.id);
      if (!job) {
      return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, job, JOB_MESSAGES.JOB_FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateJob(req: Request, res: Response, next: NextFunction) {

    try {
      
      const job = await jobService.updateJob(req.params.id, req.body.updateData);
      if (!job) {
        return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, job, JOB_MESSAGES.JOB_UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.deleteJob(req.params.id);
      if (!job) {
        return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, job, JOB_MESSAGES.JOB_DELETED);
    } catch (error) {
      next(error);
    }
  },

  async findJobsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.findJobsByCategory(req.params.id);
      res.sendResponse(httpStatus.OK, jobs, JOB_MESSAGES.JOBS_FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async incrementViewCount(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.incrementViews(req.params.id);
      if (!job) {
        return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, job, JOB_MESSAGES.JOB_UPDATED);
    } catch (error) {
      next(error);
    }
  }
};
