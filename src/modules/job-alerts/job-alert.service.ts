import JobAlertsModel from '@modules/job-alerts/job-alerts.model';
import { JOB_ALERTS_MESSAGES } from './job-alerts-enum';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
export const jobAlertServiceforJobSeeker = {
  async createJobAlertsforJobSeeker(data: any) {
    const { userId, title, frequency } = data;

    const existingJobAlert = await JobAlertsModel.findOne({
      userId,
      title: title.toLowerCase(),
    });
    if (existingJobAlert) {
      throwError(
        httpStatus.BAD_REQUEST,
        JOB_ALERTS_MESSAGES.JOB_ALERTS_ALREADY_EXISTS,
      );
    }

    const newJobAlert = new JobAlertsModel({
      userId,
      title: title.toLowerCase(),
      frequency,
    });
    await newJobAlert.save();

    return newJobAlert;
  },
  async getAllJobAlerts(data: any) {
    const { userId } = data;
    const jobAlerts = await JobAlertsModel.find({ userId });
    return {
      jobAlerts,
      jobAlertsCount: jobAlerts.length,
    };
  },
    async deleteJobAlerts(id: string) {
        const jobAlert = await JobAlertsModel.findByIdAndDelete(id);
        if (!jobAlert) {
        throwError(httpStatus.NOT_FOUND, JOB_ALERTS_MESSAGES.JOB_ALERTS_NOT_FOUND);
        }
        return jobAlert;
    },
    async updateJobAlerts(id: string, data: any) {
        const jobAlert = await JobAlertsModel.findByIdAndUpdate(
            id,
            data,
            { new: true },
        );
        if (!jobAlert) {
        throwError(httpStatus.NOT_FOUND, JOB_ALERTS_MESSAGES.JOB_ALERTS_NOT_FOUND);
        }
        return jobAlert;
    },
};
