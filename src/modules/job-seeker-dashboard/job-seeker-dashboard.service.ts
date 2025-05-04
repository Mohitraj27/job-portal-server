import User from '@modules/user/user.model';
import AppliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import { Role } from '@modules/user/user.types';
import JobModel from '@modules/jobs/jobs.model';
import { JobStatus } from '@modules/jobs/jobs.types';
import jobAlertsModel from '@modules/job-alerts/job-alerts.model';
async function calculateJobMatches(
  jobs: any[],
  userTitle: string,
  userSkills: string[],
) {
  if (!jobs || !userTitle) return [];
  return jobs
    .map((job) => {
      let matchScore = 0;
      const jobTitleLower = job.title?.toLowerCase() || '';
      const userTitleLower = userTitle?.toLowerCase() || '';
      const titleMatched =
        jobTitleLower.includes(userTitleLower) ||
        userTitleLower.includes(jobTitleLower);

      if (titleMatched) {
        matchScore += 30;
      }
      const jobSkills = job.skills || [];
      const matchedSkills = jobSkills.filter((skill: string) =>
        userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase()),
      );

      const skillMatchPercentage =
        (matchedSkills.length / jobSkills.length) * 70;
      matchScore += Math.round(skillMatchPercentage);

      return {
        ...job,
        matchPercentage: Math.min(matchScore, 100),
      };
    })
    .filter((job) => job.matchPercentage > 0);
}
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
  async appliedJobsforJobSeeker(data: any) {
    const { userId } = data;

    const appliedJobs = await AppliedCandidatesModel.find({
      candidateId: userId,
      isDeleted: false,
    })
      .populate({ path: 'jobId', select: 'title company' })
      .lean();

    const result = appliedJobs.map((applied) => {
      const job = applied.jobId as any;
      if (!job) return {};
      return {
        jobId: job?._id || '',
        jobTitle: job?.title || '',
        companyName: job?.company || '',
        status: applied.status,
      };
    });
    return result;
  },
  async recommendedJobsbasedforJobSeeker(data: any) {
    const { userId } = data;

    const user = await User.findOne({
      _id: userId,
      role: Role.JOBSEEKER,
    }).select(
        'jobSeekerDetails.professionalDetails.skills jobSeekerDetails.professionalDetails.currentJobTitle',
      ).lean();

    if (!user || !user.jobSeekerDetails?.professionalDetails) return [];

    const { currentJobTitle, skills } =
      user?.jobSeekerDetails?.professionalDetails;

    const jobs = await JobModel.find({
      status: JobStatus.ACTIVE,
      validTill: { $gte: new Date() },
    }).populate({
        path: 'createdBy.userId',
        select: 'employerDetails',
      }).lean();
      if (jobs.length === 0) return [];
      const jobIds = jobs.map((job) => job._id);
      const appliedJobs = await AppliedCandidatesModel.find({
        candidateId: userId,
        jobId: { $in: jobIds },
      }).select('jobId').lean();
      const appliedJobIdSet = new Set(appliedJobs.map((entry) => entry.jobId.toString()));
      // Filter out already applied jobs
      const notAppliedJobs = jobs.filter((job) => !appliedJobIdSet.has(job._id.toString()));
      if (notAppliedJobs?.length === 0) return [];
    /**
     * Match % Caluclation
     * Job requires: ["JavaScript", "Node.js", "React", "MongoDB"]

      User has: ["JavaScript", "Node.js", "AWS"]

      Matched: ["JavaScript", "Node.js"]

      (2 / 4) * 70 = 35% → added to the score.
      70 % of the skills match and 30% of the title match
      also if title matches then add 30% to the score and if not match it with skills only
      Jobs Recommendation will not come for Applied Jobs
     */
    const recommendedJobs = await calculateJobMatches(
      notAppliedJobs,
      currentJobTitle,
      skills,
    );
    return recommendedJobs;
  },
  async jobAlertsCount(data: any) {
    const { userId } = data;
    const jobAlertsCount = await jobAlertsModel.countDocuments({ userId });
    return jobAlertsCount;
  },
};
