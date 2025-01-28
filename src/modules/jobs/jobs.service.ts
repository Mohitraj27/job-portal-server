import httpStatus from "@utils/httpStatus";
import { JOB_MESSAGES } from "./jobs.enum";
import jobsModel from "./jobs.model";
import { IJob } from "./jobs.types";
import { throwError } from "@utils/throwError";

export const jobService = {
  async createJob(data:IJob) {
    return await jobsModel.create(data);
  },

  async getAllJobs(query = {}) {
    return await jobsModel.find(query);
  },

  async getSingleJob(jobId: string) {
    return await jobsModel.findById(jobId);
  },

  async updateJob(jobId: string, updateData: Partial<IJob>) {
    const job = await jobsModel.findById(jobId);
    if (!job) {
  return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
    }
    return await jobsModel.findByIdAndUpdate(jobId, updateData, { new: true });
  },

  async deleteJob(jobId: string) {
    return await jobsModel.findByIdAndDelete(jobId);
  },

  async countJobs(query = {}) {
    return await jobsModel.countDocuments(query);
  },

  async findJobsByCategory(categoryId: string) {
    return await jobsModel.find({ category: categoryId });
  },

  async incrementViews(jobId: string) {
    return await jobsModel.findByIdAndUpdate(
      jobId,
      { $inc: { views: 1 } },
      { new: true },
    );
  },
};
