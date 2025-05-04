import mongoose from 'mongoose';
import appliedCandidatesModel from './applied-candidates.model';
import {
  IAppliedCandidate,
  AppliedCandidateQuery,
  ApplicationStatus,
} from './applied-candidates.types';
import { APPLIED_CANDIDATES_MESSAGES } from './applied-candidates.enum';
import httpStatus from '@utils/httpStatus';
import { throwError } from '@utils/throwError';
import { Role } from '../user/user.types';
import User from '@modules/user/user.model';
import jobsModel from '@modules/jobs/jobs.model';
import { DateFilters } from './applied-candidates.types';
import { subMonths } from 'date-fns'
export const appliedCandidatesService = {
  async createApplication(data: IAppliedCandidate) {
    const existingApplication = await appliedCandidatesModel.findOne({
      jobId: data.jobId,
      candidateId: data.candidateId,
    });

    if (existingApplication) {
      return throwError(
        httpStatus.CONFLICT,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_ALREADY_EXISTS,
      );
    }

    const application = await appliedCandidatesModel.create(data);

    // Update job applicationsCount (increment by 1)
    await jobsModel.findByIdAndUpdate(data.jobId, {
      $inc: { applicationsCount: 1 },
    });

    const candidate = await User.findOne({
      _id: data.candidateId,
      role: Role.JOBSEEKER,
      isDeleted: false,
    });

    if (!candidate) {
      return throwError(
        httpStatus.BAD_REQUEST,
        'Invalid candidate. Candidate must have a role of JOBSEEKER and must not be deleted.',
      );
    }
    return application;
  },

  async getApplicationsByJobId(
    jobId: string,
    query: Partial<AppliedCandidateQuery> = {},
  ) {
    const {
      status,
      isShortlisted,
      appliedAfter,
      appliedBefore,
      sortBy = 'appliedDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filters: any = { jobId };

    // Apply filters
    if (status) {
      filters.status = status;
    }

    if (isShortlisted !== undefined) {
      filters.isShortlisted = isShortlisted;
    }

    if (appliedAfter || appliedBefore) {
      filters.appliedDate = {};
      if (appliedAfter) {
        filters.appliedDate.$gte = new Date(appliedAfter);
      }
      if (appliedBefore) {
        filters.appliedDate.$lte = new Date(appliedBefore);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Sort options
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await appliedCandidatesModel.countDocuments(filters);
    const applications = await appliedCandidatesModel
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('jobId', 'title company')

      .populate(
        'candidateId',
        'role personalDetails jobSeekerDetails professionalDetails jobPreferences applicationsHistory lastLogin isDeleted createdAt updatedAt',
      )
      .lean();
    console.log('application', applications);
    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getApplicationById(applicationId: string) {
    return await appliedCandidatesModel
      .findById(applicationId)
      .populate('jobId', 'title company validTill status')
      .populate('candidateId', 'name email');
  },

  async getApplicationsByCandidate(
    candidateId: string,
    query: Partial<AppliedCandidateQuery> = {
      appliedDateFilter: DateFilters.LAST_MONTH
    },
  ) {
    const {
      status,
      page = 1,
      limit = 10,
      shortlist,
      appliedDateFilter,
      sortBy = 'appliedDate',
      sortOrder = 'desc',
    } = query;

    const filters: any = { candidateId };

    if (status) {
      filters.status = status;
    }
    if(appliedDateFilter){
      let startDate: Date;
      const today = new Date();
      switch (appliedDateFilter) {
        case DateFilters.LAST_MONTH:
          startDate = subMonths(today, 1);
          break;
        case DateFilters.LAST_3_MONTH:
          startDate = subMonths(today, 3);
          break;
        case DateFilters.LAST_6_MONTH:
          startDate = subMonths(today, 6);
          break;
        case DateFilters.LAST_YEAR:
          startDate = subMonths(today, 12);
          break;
        default:
          throw new Error('Invalid date filter');
      }
      filters.appliedDate = { $gte: startDate };
    }    if (shortlist === 'true') {
      filters.isShortlisted = true;
    }
    if (shortlist !== undefined) {
      filters.isShortlisted = true;
    }

    const skip = (page - 1) * limit;

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await appliedCandidatesModel.countDocuments(filters);
    const applications = await appliedCandidatesModel
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'jobId',
        select: 'title company status validTill',
        populate: {
          path: 'createdBy.userId',
          select: 'employerDetails',
        },
      })
      .lean();

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ) {
    const application = await appliedCandidatesModel.findById(applicationId);

    if (!application) {
      return throwError(
        httpStatus.NOT_FOUND,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND,
      );
    }

    application.status = status;
    application.updatedAt = new Date();

    return await application.save();
  },

  async shortlistCandidate(applicationId: string, isShortlisted: boolean) {
    const application = await appliedCandidatesModel.findById(applicationId);

    if (!application) {
      return throwError(
        httpStatus.NOT_FOUND,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND,
      );
    }

    application.isShortlisted = isShortlisted;
    application.status = ApplicationStatus.SHORTLISTED;

    if (isShortlisted) {
      application.shortlistedDate = new Date();
    } else {
      application.shortlistedDate = undefined;
    }

    application.updatedAt = new Date();

    return await application.save();
  },

  async addNotes(applicationId: string, notes: string) {
    const application = await appliedCandidatesModel.findById(applicationId);

    if (!application) {
      return throwError(
        httpStatus.NOT_FOUND,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND,
      );
    }

    application.notes = notes;
    application.updatedAt = new Date();

    return await application.save();
  },

  async deleteApplication(applicationId: string) {
    const application = await appliedCandidatesModel.findById(applicationId);

    if (!application) {
      return throwError(
        httpStatus.NOT_FOUND,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND,
      );
    }

    // Decrement job applicationsCount
    await mongoose.model('Job').findByIdAndUpdate(application.jobId, {
      $inc: { applicationsCount: -1 },
    });

    return await appliedCandidatesModel.findByIdAndDelete(applicationId);
  },

  async getApplicationStats(jobId: string) {
    return await appliedCandidatesModel.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);
  },

  async getShortlistedCount(jobId: string) {
    return await appliedCandidatesModel.countDocuments({
      jobId,
      isShortlisted: true,
    });
  },

  async toggleBookmark(jobId: string, candidateId: string, isBookmarked: boolean) {
    const application = await appliedCandidatesModel.findOne({
      jobId,
      candidateId
    });
    
    if (!application) {
      return throwError(
        httpStatus.NOT_FOUND,
        APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND
      );
    }
    
    application.isBookmarked = isBookmarked;
    application.updatedAt = new Date();
    
    return await application.save();
  },
  async getShortlistedCandidatesdata(jobId: string) {
    const data = await appliedCandidatesModel.find({ jobId, isShortlisted: true })
      .populate({
        path: 'candidateId',
        select: 'role personalDetails.firstName personalDetails.lastName personalDetails.email personalDetails.profilePicture jobSeekerDetails.professionalDetails',
      })
      .populate({
        path: 'jobId',
        select: 'title description location skills education experience company numberOfOpenings createdAt',
      });
  
    return data.map(application => {
      const candidate = application.candidateId as any;
      const job = application.jobId as any;
  
      return {
        _id: application._id,
        isBookmarked: application.isBookmarked,
        isDeleted: application.$isDeleted,
        status: application.status,
        isShortlisted: application.isShortlisted,
        coverLetter: application.coverLetter,
        appliedDate: application.appliedDate,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        shortlistedDate: application.shortlistedDate,
        jobId: job,
        candidateId: {
          _id: candidate._id,
          firstName: candidate?.personalDetails?.firstName,
          lastName: candidate?.personalDetails?.lastName,
          email: candidate?.personalDetails?.email,
          phone: candidate?.personalDetails?.phone,
          professionalDetails: candidate.jobSeekerDetails?.professionalDetails || {}
        }
      };
    });
  },
};
