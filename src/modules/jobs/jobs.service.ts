import httpStatus from '@utils/httpStatus';
import { JOB_MESSAGES } from './jobs.enum';
import jobsModel from './jobs.model';
import { IJob, JobQuery } from './jobs.types';
import { throwError } from '@utils/throwError';
import TalentScout from '@modules/talent-scout/talent-scout.model';

export const jobService = {
  async createJob(data: IJob) {
    const jobCreated = await jobsModel.create(data);
    await TalentScout.create({
      jobId: jobCreated._id,
      matchCount: 0,
      isDeleted: false,
    });
    return jobCreated;
  },

  async getAllJobs(query: JobQuery = {}) {
    const {
      keywords,
      location,
      radius = 100,
      salaryRange,
      educationLevel,
      jobType,
      experienceLevel,
      datePosted,
      userId,
    } = query;

    const filters = [];

    if (keywords) {
      filters.push({
        $or: [
          { title: { $regex: keywords, $options: 'i' } },
          { company: { $regex: keywords, $options: 'i' } },
          { description: { $regex: keywords, $options: 'i' } },
        ],
      });
    }

    if (location && location.lat && location.lng) {
      filters.push({
        location: {
          $geoWithin: {
            $centerSphere: [[location.lng, location.lat], radius / 6378.1],
          },
        },
      });
    }

    if (salaryRange?.min || salaryRange?.max) {
      const salaryFilter: Record<string, number> = {};
      if (salaryRange.min) salaryFilter.$gte = salaryRange.min;
      if (salaryRange.max) salaryFilter.$lte = salaryRange.max;

      filters.push({ salary: salaryFilter });
    }

    if (educationLevel?.length) {
      filters.push({ educationLevel: { $in: educationLevel } });
    }

    if (jobType?.length) {
      filters.push({ jobType: { $in: jobType } });
    }

    if (experienceLevel?.length) {
      filters.push({ experienceLevel: { $in: experienceLevel } });
    }
    if (userId) {
      filters.push({ createdBy: userId });
    }

    if (datePosted) {
      const now = new Date();
      let dateThreshold;

      switch (datePosted) {
        case 'Last 24 hours':
          dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'Last 7 days':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 14 days':
          dateThreshold = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }

      if (dateThreshold) {
        filters.push({ postedDate: { $gte: dateThreshold } });
      }
    }

    const pipeline = [
      {
        $match: filters.length ? { $and: filters } : {},
      },
      {
        $sort: { updatedAt: -1 as 1 | -1 },
      }
    ];

    return await jobsModel.aggregate(pipeline);
  },

  async getSingleJob(jobId: string) {
    return await jobsModel.findById(jobId);
  },

  async updateJob(jobId: string, updateData: Partial<IJob>) {
    const job = await jobsModel.findById(jobId);
    if (!job) {
      return throwError(httpStatus.NOT_FOUND, JOB_MESSAGES.JOB_NOT_FOUND);
    }
    return await jobsModel.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
      select: '-__v -createdAt -updatedAt',
    });
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
