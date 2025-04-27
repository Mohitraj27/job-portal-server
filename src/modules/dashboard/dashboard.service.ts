
import JobsModel from '@modules/jobs/jobs.model';
import {JobStatus} from '@modules/jobs/jobs.types';
import AppliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import {ApplicationStatus} from '@modules/applied-candidates/applied-candidates.types';
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

    // Find jobs created by the user
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
    const totalViewsCount = await JobsModel.aggregate([
      {
        $match: {
          'createdBy.userId': userId,
          status: JobStatus.ACTIVE,
          validTill: { $gte: new Date() },
        }
      },
      // {
      //   $group: {
      //     _id: null,
      //     totalViews: { $sum: '$views' }, 
      //   },
      // },
    ]);
    return totalViewsCount;
  }
}
