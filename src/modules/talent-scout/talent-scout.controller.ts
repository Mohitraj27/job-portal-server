import { NextFunction, Request, Response } from 'express';
import { TALENT_SCOUT_MESSAGES } from './talent-scout.enum';
import httpStatus from '@utils/httpStatus';
import { talentScoutService } from './talent-scout.service';
export const talentScoutController = {
  getTalentScoutDetails: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
        const  { jobId }  = req.body;
        const dataforTalentScout = await talentScoutService.getTalentScoutDetails(jobId as string);
        res.sendResponse(httpStatus.OK, dataforTalentScout, TALENT_SCOUT_MESSAGES.TALENT_SCOUT_FETCHED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },
  getAdvanceTalentScoutDetails: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const queryParams = req.query; // All filters passed from query
      const candidates = await talentScoutService.getAdvanceTalentScoutDetails(queryParams);
      res.sendResponse(httpStatus.OK, candidates, TALENT_SCOUT_MESSAGES.TALENT_SCOUT_FETCHED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },
  async getTalentScoutJobs(req: Request, res: Response, next: NextFunction) {
      try {
        const {id} = req.params
        console.log("userId",id)
        const jobs = await talentScoutService.getTalentScoutJobs(id);
        res.sendResponse(httpStatus.OK, jobs, TALENT_SCOUT_MESSAGES.JOBS_FETCHED);
      } catch (error) {
        next(error);
      }
    },
};
