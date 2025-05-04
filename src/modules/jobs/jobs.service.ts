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

    let salaryObject = null;
    if (salaryRange) {
      salaryObject =
        typeof salaryRange === 'string' ? JSON.parse(salaryRange) : null;
    }
    console.log('educationLevel---------->', educationLevel);
    let jobsArray = Array.isArray(jobType)
      ? jobType.map((item) => item.trim())
      : [];

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

    if (salaryObject?.min || salaryObject?.max) {
      const salaryFilter: Record<string, number> = {};
      if (salaryObject.min) salaryFilter.$gte = salaryObject.min;
      if (salaryObject.max) salaryFilter.$lte = salaryObject.max;

      filters.push({ salary: salaryFilter });
    }

    if (educationLevel) {
      filters.push({ educationLevel: educationLevel });
    }

    if (jobsArray?.length > 0) {
      filters.push({ jobType: { $in: jobsArray } });
    }

    if (experienceLevel) {
      filters.push({ experienceLevel: experienceLevel });
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
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy.userId',
          foreignField: '_id',
          as: 'createdByDetails',
        },
      },
      {
        $unwind: {
          path: '$createdByDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          company: 1,
          description: 1,
          location: 1,
          employmentType: 1,
          industry: 1,
          skills: 1,
          experience: 1,
          education: 1,
          languages: 1,
          salary: 1,
          numberOfOpenings: 1,
          postedAt: 1,
          validTill: 1,
          benefits: 1,
          applicationLink: 1,
          remote: 1,
          createdBy: 1,
          status: 1,
          priority: 1,
          tags: 1,
          views: 1,
          applicationsCount: 1,
          savedCount: 1,
          moderationStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          createdByDetails: {
            _id: 1,
            companyName: '$createdByDetails.employerDetails.companyName',
            logoUrl: '$createdByDetails.employerDetails.logoUrl',
            state: '$createdByDetails.employerDetails.contactInfo.state',
            city: '$createdByDetails.employerDetails.contactInfo.city',
            country: '$createdByDetails.employerDetails.contactInfo.country',
            completeAddress:
              '$createdByDetails.employerDetails.contactInfo.completeAddress',
            
          },
        },
      },
    ];

    return await jobsModel.aggregate(pipeline);
  },

  async getSingleJob(jobId: string) {
    return await jobsModel.findById(jobId)
      .populate({
        path: 'createdBy.userId',
        select: 'employerDetails.companyName employerDetails.logoUrl employerDetails.contactInfo.state employerDetails.contactInfo.city employerDetails.contactInfo.country employerDetails.contactInfo.completeAddress',
        model: 'User',
      })
      .select('-__v -createdAt -updatedAt');
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
