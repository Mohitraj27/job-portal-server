import { NextFunction,  Request, Response } from 'express';
import { dashboardService } from '@modules/dashboard/dashboard.service';
import httpStatus from '@utils/httpStatus';
import { DASHBOARD_MESSAGES } from '@modules/dashboard/dashboard.enum';
export const dashboardController = {
  async countJobPostings(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await dashboardService.countJobPostings(req.body);
      res.sendResponse(httpStatus.CREATED, application, DASHBOARD_MESSAGES.TOTAL_JOB_POSTING_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async countActiveApplicants(req: Request, res: Response, next: NextFunction) {
    try {
      const applicants = await dashboardService.countActiveApplicants(req.body);
      res.sendResponse(httpStatus.CREATED, applicants, DASHBOARD_MESSAGES.TOTAL_ACTIVE_APPLICANTS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async jobpostlisting(req:Request, res: Response,next: NextFunction){
    try{
      const listedJobData = await dashboardService.listJobPostings(req.body);
      res.sendResponse(httpStatus.CREATED, listedJobData, DASHBOARD_MESSAGES.JOB_LIST_POSTINGS_FETCHED);
    }catch(error){
      next(error);
    }
  }
  
};