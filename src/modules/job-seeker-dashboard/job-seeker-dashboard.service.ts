import User from '@modules/user/user.model';
import AppliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import { Role } from '@modules/user/user.types';
import {ApplicationStatus} from '@modules/applied-candidates/applied-candidates.types';
export const jobseekerDashboardService = {
  async countAppliedJob(data: any) {
    const { userId } = data;
    const user = await User.findOne({ _id: userId, role: Role.JOBSEEKER });
    if (!user) {
      return 0;
    }
    const appliedJobCount = await AppliedCandidatesModel.countDocuments({
      candidateId: userId,
      status: ApplicationStatus.APPLIED,
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
  
}
