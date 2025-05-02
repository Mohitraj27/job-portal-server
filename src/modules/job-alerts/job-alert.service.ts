import JobAlertsModel from '@modules/job-alerts/job-alerts.model';
import JobsModel from '@modules/jobs/jobs.model';
import {JOB_ALERTS_MESSAGES} from './job-alerts-enum';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
export const jobAlertServiceforJobSeeker = {
    async createJobAlertsforJobSeeker(data: any) {
        const { userId, title } = data;
       
        const lowercaseTitle = title.toLowerCase();
        const jobs = await JobsModel.find().lean();
        const matchingJobs = jobs.filter(job => job.title.toLowerCase() === lowercaseTitle);
        
        if (matchingJobs.length === 0) {
            throwError(httpStatus.BAD_REQUEST, JOB_ALERTS_MESSAGES.NO_JOBS_FOUND_MATCHING_JOB_ALERTS);
        } 
            const jobAlertAlreadyExist = await JobAlertsModel.findOne({
                userId,
                title: title.toLowerCase(),
            });
            if (jobAlertAlreadyExist) {
                throwError(httpStatus.BAD_REQUEST, JOB_ALERTS_MESSAGES.JOB_ALERTS_ALREADY_EXISTS);
            }
        const jobAlert = await JobAlertsModel.findOneAndUpdate(
            {
                userId,
                title: title.toLowerCase(),
            },
            {
                userId,
                title: title.toLowerCase(),
            },
            {
                new: true,
                upsert: true,
            }
        );
        jobAlert.jobs = jobs;
        return jobAlert;
      },
      async getAllJobAlerts(data: any) {
        const { userId } = data;
        const jobAlerts = await JobAlertsModel.find({ userId });
        return { 
          jobAlerts, 
          jobAlertsCount: jobAlerts.length 
        };
      },
};