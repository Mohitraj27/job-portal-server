
import JobsModel from '@modules/jobs/jobs.model';
import {JobStatus} from '@modules/jobs/jobs.types';
import AppliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import {ApplicationStatus} from '@modules/applied-candidates/applied-candidates.types';
import mongoose from 'mongoose';
export const dashboardService = {
  async countJobPostings(data: any) {
    const { userId } = data;
    const count = await JobsModel.countDocuments({
      'createdBy.userId': userId,
      status: JobStatus.ACTIVE,
      validTill: { $gt: new Date() },
    });
    return count;
  },
  async countActiveApplicants(data: any) {
    const { userId } = data;

    const jobs = await JobsModel.find({
      'createdBy.userId': userId,
      status: JobStatus.ACTIVE,
      validTill: { $gt: new Date() },
    }, { _id: 1 });

    const jobIds = jobs.map(job => job._id);

    if (jobIds.length === 0) {
      return 0;
    }
    const result = await AppliedCandidatesModel.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          isDeleted: false,
          status: { 
            $in: [
              ApplicationStatus.APPLIED, 
              ApplicationStatus.REVIEWED, 
              ApplicationStatus.INTERVIEWING, 
              ApplicationStatus.SHORTLISTED
            ]
          },
        },
      },
      {
        $count: 'totalActiveApplicants'
      }
    ]);

    return result.length > 0 ? result[0].totalActiveApplicants : 0;
  },
  async listJobPostings(data: any) {
    const { userId } = data;

    const jobs = await JobsModel.find({
      'createdBy.userId': userId,
    }).select('title industry applicationsCount location remote status validTill');

    const jobList = jobs.map(job => {
      const now = new Date();
      const validTillDate = new Date(job.validTill);
      let daysLeft = Math.ceil((validTillDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)); 

      // Make sure no negative days are shown
      daysLeft = daysLeft < 0 ? 0 : daysLeft;

      return {
        _id: job._id,
        title: job.title,
        industry: job.industry,
        applicationsCount: job.applicationsCount,
        location: job.location,
        remote: job.remote,
        status: job.status,
        daysLeft: daysLeft,
      };
    });
    return jobList;
  },

  async totalApplicants(data: any) {
    const { userId } = data;

    const jobs = await JobsModel.find({
      'createdBy.userId': userId,
      status: JobStatus.ACTIVE,
      validTill: { $gt: new Date() },
    }, { _id: 1 });

    const jobIds = jobs.map(job => job._id);

    if (jobIds.length === 0) {
      return 0;
    }
    const result = await AppliedCandidatesModel.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          isDeleted: false,
        },
      },
      {
        $count: 'totalActiveApplicants'
      }
    ]);

    return result.length > 0 ? result[0].totalActiveApplicants : 0;
  },
  async totalshortlistedcandidates(data: any) {
      const { userId } = data;
  
      const jobs = await JobsModel.find({
        'createdBy.userId': userId,
        status: JobStatus.ACTIVE,
        validTill: { $gte: new Date() }, 
      }).select('_id');
  
      const jobIds = jobs.map(job => job._id);
  
      if (jobIds.length === 0) {
        return 0; 
      }

      const totalShortlistCount = await AppliedCandidatesModel.countDocuments({
        jobId: { $in: jobIds },
        isDeleted: false,
        isShortlisted: true,
      });

      return totalShortlistCount;
  },
  async totalViewsCountforJob(data: any) {
    const { userId } = data;
    const result = await JobsModel.aggregate([
      {
        $match: {
          'createdBy.userId': new mongoose.Types.ObjectId(userId), 
          status: JobStatus.ACTIVE,
          validTill: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: { $ifNull: ['$views', 0] } }, 
        },
      },
    ]);
  
    return result.length > 0 ? result[0].totalViews : 0;
  },
  async applicantTrends(data: any) {
    const { userId } = data;

    const pipeline = [
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails',
        }
      },
      { $unwind: '$jobDetails' },
      {
        $match: {
          'jobDetails.createdBy.userId': new mongoose.Types.ObjectId(userId),
          'jobDetails.status': 'ACTIVE',
          'jobDetails.validTill': { $gte: new Date() },
        }
      },
      {
        $project: {
          appliedDate: 1,
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$appliedDate' }, 
          count: { $sum: 1 }
        }
      }
    ];
  
    const result = await AppliedCandidatesModel.aggregate(pipeline);
  
    const dayMapping = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat',
    };
  
    const finalResult: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
  
    for (const item of result) {
      const dayNumber = item._id as number; 
      const day = dayMapping[dayNumber as keyof typeof dayMapping];
    
      if (day) {
        finalResult[day] += item.count;
      }
    }
  
    return finalResult;
  }
}
