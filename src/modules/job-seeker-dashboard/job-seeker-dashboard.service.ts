import User from '@modules/user/user.model';
import AppliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import { Role } from '@modules/user/user.types';
export const jobseekerDashboardService = {
  async countAppliedJob(data: any) {
    const { userId } = data;
    const user = await User.findOne({ _id: userId, role: Role.JOBSEEKER });
    if (!user) {
      return 0;
    }
    const appliedJobCount = await AppliedCandidatesModel.countDocuments({
      candidateId: userId,
      isDeleted: false,
    });
    return appliedJobCount;
  },
  async countShortlistedJob(data: any) {
    const { userId } = data;
    const user = await User.findOne({ _id: userId, role: Role.JOBSEEKER });
    if (!user) {
      return 0;
    }
    const shortlistedJobCount = await AppliedCandidatesModel.countDocuments({
      candidateId: userId,
      isShortlisted: true,
      isDeleted: false,
    });
    return shortlistedJobCount;
  },
  async appliedJobsforJobSeeker(data: any){
    const { userId } = data;
    
  const appliedJobs = await AppliedCandidatesModel.find({
    candidateId: userId,
    isDeleted: false,
  }).populate({ path: 'jobId', select: 'title company'}).lean();

  const result = appliedJobs.map(applied => {
    const job = applied.jobId as any; 
    if(!job) return {};
    return {
      jobId: job?._id || '',
      jobTitle: job?.title || '',
      companyName: job?.company || '',
      status: applied.status,
    };
  });
  return result;
  }
}
