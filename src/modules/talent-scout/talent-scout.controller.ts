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
  
};
