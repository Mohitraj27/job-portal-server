import { NextFunction,  Request, Response } from 'express';
import { dashboardService } from '@modules/dashboard/dashboard.service';
import httpStatus from '@utils/httpStatus';
import { DASHBOARD_MESSAGES } from '@modules/dashboard/dashboard.enum';
export const dashboardController = {
  async countJobPostings(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await dashboardService.countJobPostings(req.params as any);
      res.sendResponse(httpStatus.OK, application, DASHBOARD_MESSAGES.TOTAL_JOB_POSTING_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async countActiveApplicants(req: Request, res: Response, next: NextFunction) {
    try {
      const applicants = await dashboardService.countActiveApplicants(req.params as any);
      res.sendResponse(httpStatus.OK, applicants, DASHBOARD_MESSAGES.TOTAL_ACTIVE_APPLICANTS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async jobpostlisting(req:Request, res: Response,next: NextFunction){
    try{
      const listedJobData = await dashboardService.listJobPostings(req.params as any);
      res.sendResponse(httpStatus.OK, listedJobData, DASHBOARD_MESSAGES.JOB_LIST_POSTINGS_FETCHED);
    }catch(error){
      next(error);
    }
  },
  async totalApplicants(req:Request,res:Response,next:NextFunction){
    try{
      const totalApplicants = await dashboardService.totalApplicants(req.params as any);
      res.sendResponse(httpStatus.OK, totalApplicants, DASHBOARD_MESSAGES.TOTAL_APPLICANTS_FETCHED);
    }catch(error){
      next(error);
    }
  },
  async totalshortlistedcandidates(req:Request,res:Response,next:NextFunction){
    try{
      const totalShortlistedCandidates = await dashboardService.totalshortlistedcandidates(req.params as any);
      res.sendResponse(httpStatus.OK, totalShortlistedCandidates, DASHBOARD_MESSAGES.TOTAL_SHORTLISTED_CANDIDATES_FETCHED);
    }catch(error){
      next(error);
    }
  },
  async totalViewsCountforJob(req:Request,res:Response,next:NextFunction){
    try{
      const totalViewsCount = await dashboardService.totalViewsCountforJob(req.params);
      res.sendResponse(httpStatus.OK, totalViewsCount, DASHBOARD_MESSAGES.TOTAL_VIEWS_COUNT_FETCHED_FOR_JOBS);
    }catch(error){
      next(error);
    }
  },
  async applicantTrends(req:Request , res:Response, next:NextFunction){
    try{
      const applicantTrends = await dashboardService.applicantTrends(req.params as any);
      res.sendResponse(httpStatus.OK, applicantTrends, DASHBOARD_MESSAGES.APPLICANT_TRENDS_FETCHED);
    }catch(error){
      next(error);
    }
  },
  async jobExpirycount(req:Request , res:Response, next:NextFunction){
    try{
      const jobExpiryCount = await dashboardService.jobExpirycount(req.params as any);
      res.sendResponse(httpStatus.OK, jobExpiryCount, DASHBOARD_MESSAGES.JOB_EXPIRY_COUNT_FETCHED);
    }catch(error){
      next(error);
    }
  }
};