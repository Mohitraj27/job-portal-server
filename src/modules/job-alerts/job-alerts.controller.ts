import { jobAlertServiceforJobSeeker } from "./job-alert.service";
import { NextFunction,  Request, Response } from 'express';
import httpStatus from '@utils/httpStatus';
import { JOB_ALERTS_MESSAGES } from './job-alerts-enum';
export const jobAlertsController = {
    createJobAlerts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobAlerts = await jobAlertServiceforJobSeeker.createJobAlertsforJobSeeker(req.body);
            res.sendResponse(httpStatus.CREATED, jobAlerts, JOB_ALERTS_MESSAGES.JOB_ALERTS_CREATED);
        } catch (error) {
            next(error);
        }
    },
    getAllJobAlerts: async(req:Request, res:Response, next:NextFunction) => {
        try {
            const jobAlerts = await jobAlertServiceforJobSeeker.getAllJobAlerts(req.params);
            res.sendResponse(httpStatus.OK, jobAlerts, JOB_ALERTS_MESSAGES.JOB_ALERTS_FETCHED);
        } catch (error) {
            next(error);
        }
    },
    deleteJobAlerts: async(req:Request, res:Response, next:NextFunction) => {
        try {
            const jobAlerts = await jobAlertServiceforJobSeeker.deleteJobAlerts(req.params.id);
            res.sendResponse(httpStatus.OK, jobAlerts, JOB_ALERTS_MESSAGES.JOB_ALERTS_DELETED);
        } catch (error) {
            next(error);
        }
    },
    updateJobAlerts: async(req:Request, res:Response, next:NextFunction) => {
        try {
            const jobAlerts = await jobAlertServiceforJobSeeker.updateJobAlerts(req.params.id, req.body);
            res.sendResponse(httpStatus.OK, jobAlerts, JOB_ALERTS_MESSAGES.JOB_ALERTS_UPDATED);
        } catch (error) {
            next(error);
        }
    }
};