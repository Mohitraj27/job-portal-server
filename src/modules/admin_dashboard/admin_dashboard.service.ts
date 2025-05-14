
import User from '@modules/user/user.model';
import admin_dashboardModel from './admin_dashboard.model';
import { IAdmin_dashboard } from './admin_dashboard.types';
import appliedCandidatesModel from '@modules/applied-candidates/applied-candidates.model';
import jobsModel from '@modules/jobs/jobs.model';

export const admin_dashboardService = {
  async createAdmin_dashboard(data: IAdmin_dashboard) {
    return await admin_dashboardModel.create(data);
  },

  async getAllAdmin_dashboards(query: any) {
    return await admin_dashboardModel.find(query);
  },

  async getSingleAdmin_dashboard(id: string) {
    return await admin_dashboardModel.findById(id);
  },

  async updateAdmin_dashboard(id: string, data: Partial<IAdmin_dashboard>) {
    return await admin_dashboardModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  },

  async deleteAdmin_dashboard(id: string) {
    return await admin_dashboardModel.findByIdAndDelete(id);
  },
  async getAdmin_dashboardCardsCount() {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [userStats, applicationStats, jobStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUser: { $sum: 1 },
            totalEmployer: {
              $sum: {
                $cond: [{ $eq: ['$role', 'EMPLOYER'] }, 1, 0],
              },
            },
            totalJobSeeker: {
              $sum: {
                $cond: [{ $eq: ['$role', 'JOBSEEKER'] }, 1, 0],
              },
            },
          },
        },
      ]),
      appliedCandidatesModel.aggregate([
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            todaysApplications: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$appliedDate', todayStart] },
                      { $lt: ['$appliedDate', todayEnd] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      jobsModel.aggregate([
        {
          $group: {
            _id: null,
            activeJobPosting: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0],
              },
            },
            thisWeekCount: {
              $sum: {
                $cond: [{ $gte: ['$createdAt', weekAgo] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    return {
      totalUser: userStats[0]?.totalUser || 0,
      totalEmployer: userStats[0]?.totalEmployer || 0,
      totalJobSeeker: userStats[0]?.totalJobSeeker || 0,
      totalApplications: applicationStats[0]?.totalApplications || 0,
      todaysApplications: applicationStats[0]?.todaysApplications || 0,
      activeJobPosting: jobStats[0]?.activeJobPosting || 0,
      thisWeekCount: jobStats[0]?.thisWeekCount || 0,
    };
  },
  async getUserRegistrationTrends() {
    const now = new Date();
    const monthLabels = [];
    const trendsMap = new Map();

    // Month name lookup
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Step 1: Generate past 7 months (month, year)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth(); // 0-based
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      monthLabels.push({ key, month, year });
      trendsMap.set(key, {
        month: monthNames[month],
        year,
        jobSeekers: 0,
        employers: 0,
      });
    }

    // Step 2: MongoDB aggregation
    const userRegistrationData = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$createdAt' }, // 1-12
          year: { $year: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year',
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            month: '$_id.month',
            year: '$_id.year',
          },
          jobSeekers: {
            $sum: {
              $cond: [{ $eq: ['$_id.role', 'JOBSEEKER'] }, '$count', 0],
            },
          },
          employers: {
            $sum: {
              $cond: [{ $eq: ['$_id.role', 'EMPLOYER'] }, '$count', 0],
            },
          },
        },
      },
    ]);

    // Step 3: Merge real data with generated list
    for (const item of userRegistrationData) {
      const monthIndex = item._id.month - 1; // 0-based
      const key = `${item._id.year}-${monthIndex}`;
      if (trendsMap.has(key)) {
        trendsMap.set(key, {
          month: monthNames[monthIndex],
          year: item._id.year,
          jobSeekers: item.jobSeekers,
          employers: item.employers,
        });
      }
    }

    // Step 4: Return sorted array
    return Array.from(trendsMap.values()).sort(
      (a, b) =>
        a.year - b.year ||
        monthNames.indexOf(a.month) - monthNames.indexOf(b.month),
    );
  },
  async  getMonthlyJobApplicationTrends() {
    const now = new Date();
  
    // Step 1: Pre-fill past 7 months with 0
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendsMap = new Map();
  
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      trendsMap.set(key, {
        month: monthNames[date.getMonth()],
        applications: 0,
      });
    }
  
    // Step 2: Run aggregation
    const result = await appliedCandidatesModel.aggregate([
      {
        $match: {
          appliedDate: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          },
        },
      },
      {
        $addFields: {
          month: { $month: "$appliedDate" }, // 1-12
          year: { $year: "$appliedDate" },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month", // 1-12
          },
          applications: { $sum: 1 },
        },
      },
    ]);
  
    // Step 3: Merge result with prefilled months
    for (const item of result) {
      const monthIndex = item._id.month - 1;
      const key = `${item._id.year}-${monthIndex}`;
      if (trendsMap.has(key)) {
        trendsMap.set(key, {
          month: monthNames[monthIndex],
          applications: item.applications,
        });
      }
    }
  
    // Step 4: Return sorted array
    return Array.from(trendsMap.values());
  },
  async  getJobSeekerDemographics() {
    const users = await User.find({
      role: "JOBSEEKER",
      isDeleted: false,
    });
  
    const ageBuckets = {
      "18-22": 0,
      "23-27": 0,
      "28-32": 0,
      "33+": 0,
    };
  
    const experienceLevels = {
      entry: 0, // 0-2 years
      mid: 0,   // 2-5 years
      senior: 0 // >5 years
    };
  
    const skillCountMap = new Map();
    let totalAgeCount = 0;
    let totalExpCount = 0;
  
    for (const user of users) {
      // Age distribution
      const age = user.personalDetails?.age;
      if (age && ageBuckets.hasOwnProperty(age)) {
        ageBuckets[age as keyof typeof ageBuckets]++;
        totalAgeCount++;
      }
  
      // Experience level
      const experience = user.jobSeekerDetails?.professionalDetails?.totalExperience;
      if (typeof experience === "number") {
        if (experience <= 2) {
          experienceLevels.entry++;
        } else if (experience <= 5) {
          experienceLevels.mid++;
        } else {
          experienceLevels.senior++;
        }
        totalExpCount++;
      }
  
      // Skills
      const skills = user.jobSeekerDetails?.professionalDetails?.skills || [];
      for (const skill of skills) {
        skillCountMap.set(skill, (skillCountMap.get(skill) || 0) + 1);
      }
    }
  
    // Convert age buckets to percentage
    const ageDistribution = Object.entries(ageBuckets).map(([label, count]) => ({
      label,
      percentage: totalAgeCount === 0 ? 0 : Math.round((count / totalAgeCount) * 100),
    }));
  
    // Convert experience levels to percentage
    const experienceLevel = {
      entry: totalExpCount === 0 ? 0 : Math.round((experienceLevels.entry / totalExpCount) * 100),
      mid: totalExpCount === 0 ? 0 : Math.round((experienceLevels.mid / totalExpCount) * 100),
      senior: totalExpCount === 0 ? 0 : Math.round((experienceLevels.senior / totalExpCount) * 100),
    };
  
    // Top 5 skills
    const topSkills = Array.from(skillCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);
  
    return {
      ageDistribution,
      experienceLevel,
      topSkills,
    };
  },
  async  getJobSeekerActivity() {
    // Fetch applications with job details
    const applications = await appliedCandidatesModel.find({ isDeleted: false })
      .populate<{ jobId: { status: string; remote: boolean; employmentType: string } }>("jobId");
  
    // Counters for job types
    const jobTypeCounts = {
      remote: 0,
      full_time: 0,
      part_time: 0,
      contract: 0,
    };
  
    // Counters for application status
    const statusCounts = {
      applied: 0,
      shortlisted: 0,
      interviewed: 0,
      rejected: 0,
      hired: 0,
    };
  
    let totalJobTypes = 0;
    let totalStatus = 0;
  
    // Helper inside main function
    function getPercent(count: number, total: number): number {
      return total === 0 ? 0 : Math.round((count / total) * 100);
    }
  
    for (const app of applications) {
      const job = app.jobId;
  
      if (!job || (job as { status: string }).status !== "ACTIVE") continue;
  
      // --- Job Type Count ---
      if (job.remote) {
        jobTypeCounts.remote++;
        totalJobTypes++;
      } else {
        switch (job.employmentType) {
          case "FULL_TIME":
            jobTypeCounts.full_time++;
            totalJobTypes++;
            break;
          case "PART_TIME":
            jobTypeCounts.part_time++;
            totalJobTypes++;
            break;
          case "CONTRACT":
            jobTypeCounts.contract++;
            totalJobTypes++;
            break;
        }
      }
  
      // --- Application Status Count ---
      const status = app.status?.toUpperCase();
      if (statusCounts.hasOwnProperty(status.toLowerCase())) {
        statusCounts[status.toLowerCase() as keyof typeof statusCounts]++;
        totalStatus++;
      }
    }
  
    return {
      mostAppliedJobTypes: [
        { label: "Remote Positions", percentage: getPercent(jobTypeCounts.remote, totalJobTypes) },
        { label: "Full-time Positions", percentage: getPercent(jobTypeCounts.full_time, totalJobTypes) },
        { label: "Contract Positions", percentage: getPercent(jobTypeCounts.contract, totalJobTypes) },
        { label: "Part-time Positions", percentage: getPercent(jobTypeCounts.part_time, totalJobTypes) },
      ],
      applicationStatus: [
        { label: "Applied", percentage: getPercent(statusCounts.applied, totalStatus) },
        { label: "Shortlisted", percentage: getPercent(statusCounts.shortlisted, totalStatus) },
        { label: "Interviewed", percentage: getPercent(statusCounts.interviewed, totalStatus) },
        { label: "Rejected", percentage: getPercent(statusCounts.rejected, totalStatus) },
        { label: "Hired", percentage: getPercent(statusCounts.hired, totalStatus) },
      ]
    };
  }
  
  
  
};