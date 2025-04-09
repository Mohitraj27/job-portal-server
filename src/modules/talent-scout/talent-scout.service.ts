import mongoose from "mongoose";
import TalentScout from "./talent-scout.model";
import jobsModel from "@modules/jobs/jobs.model";
import usersModel from "@modules/user/user.model";
// import appliedCandidatesModel from "@modules/applied-candidates/applied-candidates.model";
const mapExperienceLevel = (experienceLevel: string) => {
    switch (experienceLevel) {
      case 'Entry Level':
        return { $lte: 2 };
      case 'Mid Level':
        return { $gt: 2, $lte: 5 };
      case 'Senior Level':
        return { $gt: 5, $lte: 10 };
      case 'Director':
        return { $gt: 10, $lte: 15 };
      case 'Executive':
        return { $gt: 15 };
      default:
        return {};
    }
  }
export const talentScoutService = {
    getTalentScoutDetails: async (jobId: string) => { 
        const jobIdObject = new mongoose.Types.ObjectId(jobId);
        console.log('this is jobIdObject', jobIdObject);
        const existingEntries = await TalentScout.find({
            jobId: jobIdObject,
            isDeleted: false,
            candidateId: { $exists: true, $not: { $size: 0 } }
        });

        const data = await TalentScout.find({
            jobId: jobIdObject,
            isDeleted: false
        }).populate({
            path: 'candidateId',
            select: 'personalDetails.firstName personalDetails.lastName personalDetails.email personalDetails.profilePicture jobSeekerDetails.professionalDetails',
            match: { isDeleted: false }
        });
        console.log('this is data found From TalentScout Model',data);
        console.log('type of ',typeof data);
        // If no entries with candidateId, run matching logic once
        if (existingEntries.length === 0) {
            // This can be queued in future (e.g., Bull Queue)
            console.log('this is jobIdObject',jobIdObject);
            console.log('this is data',data);
            await talentScoutService.updateMatchCounts(jobIdObject as object, data as object);
        }
        return data;
    },
    updateMatchCounts: async (jobIdObject: object, data: object) => {
        console.log('this is jobIdObject',typeof jobIdObject);
        console.log('this is jobIdObject recived',jobIdObject);
        console.log('this is data recived',data);
        const job = await jobsModel.find({jobId: jobIdObject}).select('title skills');
        // const jobSkills = job.skills || [];
        // const jobTitle = job.title || '';
        // const jobSKills =  [];
        // const  jobTitle  =  [];
        console.log('This is user Details',JSON.stringify(data));
        console.log('this is job DEtails',job);
        const users = await usersModel.find();

        console.log('this is list of users found',users);
        // let hasMatch = false;

        // for (const user of users) {
        //     let matchCount = 0;
        //     const userSkills = user.jobSeekerDetails?.professionalDetails?.skills || [];
        //     const userJobTitle = user.jobSeekerDetails?.professionalDetails?.currentJobTitle || '';

        //     // Skill matching
        //     if (userSkills.length > 0 && jobSkills.length > 0) {
        //         for (const userSkill of userSkills) {
        //             if (jobSkills.some(jobSkill =>
        //                 jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
        //                 userSkill.toLowerCase().includes(jobSkill.toLowerCase())
        //             )) {
        //                 matchCount++;
        //                 break;
        //             }
        //         }
        //     }

        //     // Job title matching
        //     if (
        //         userJobTitle &&
        //         (userJobTitle.toLowerCase().includes(jobTitle.toLowerCase()) ||
        //             jobTitle.toLowerCase().includes(userJobTitle.toLowerCase()))
        //     ) {
        //         matchCount += 2;
        //     }

        //     if (matchCount > 0) {
        //         hasMatch = true;
        //         await TalentScout.findOneAndUpdate(
        //             { jobId, candidateId: user._id },
        //             {
        //                 jobId,
        //                 candidateId: user._id,
        //                 matchCount,
        //                 isDeleted: false,
        //                 updatedAt: new Date(),
        //             },
        //             { upsert: true, new: true }
        //         );
        //     }
        // }

        // // If no matches were found, ensure at least one base document exists for the job
        // if (!hasMatch) {
        //     const exists = await TalentScout.findOne({ jobId });
        //     if (!exists) {
        //         await TalentScout.create({
        //             jobId,
        //             matchCount: 0,
        //             isDeleted: false
        //         });
        //     }
        // }
    },
    getAdvanceTalentScoutDetails: async (queryParams: any) => {
        const {
          keywords,         // For skills, title, company semantic search
          location,         // For preferred location
          experienceLevel,  // Enum: Entry Level, Mid Level, etc.
          industryType,
          workType,
          expectedSalaryMin,
          expectedSalaryMax,
          Availability, // match with notice period
        } = queryParams;
    
        const query: any = {
          role: 'JOBSEEKER',
          isDeleted: false
        };
    
        // 🔍 Semantic Search (basic regex search for skills, title, companyName)
        if (keywords) {
          const regex = new RegExp(keywords, 'i');
          query.$or = [
            { 'jobSeekerDetails.professionalDetails.skills': regex },
            { 'jobSeekerDetails.professionalDetails.currentJobTitle': regex },
            { 'employerDetails.companyName': regex }
          ];
        }
    
        // 📍 Location Filter
        if (location) {
          const locationRegex = new RegExp(location, 'i');
          query['jobSeekerDetails.jobPreferences.preferredLocations'] = locationRegex;
        }
    
        // 💼 Experience Level Mapping
        if (experienceLevel) {
          query['jobSeekerDetails.professionalDetails.totalExperience'] = mapExperienceLevel(experienceLevel);
        }
          // 🏢 Industry type filter (semantic match inside preferredIndustries array)
        if (industryType) {
            const industryRegex = new RegExp(industryType, 'i');
            query['jobSeekerDetails.jobPreferences.preferredIndustries'] = industryRegex;
        }

        // 🏡 Work Type filter (semantic match)
        if (workType) {
            const workTypeRegex = new RegExp(workType, 'i');
            query['jobSeekerDetails.professionalDetails.employmentType'] = workTypeRegex;
        }

        // 💰 Salary range filter (expected CTC)
        if (expectedSalaryMin || expectedSalaryMax) {
            query['jobSeekerDetails.professionalDetails.expectedCTC'] = {};
            if (expectedSalaryMin) {
            query['jobSeekerDetails.professionalDetails.expectedCTC'].$gte = Number(expectedSalaryMin);
            }
            if (expectedSalaryMax) {
            query['jobSeekerDetails.professionalDetails.expectedCTC'].$lte = Number(expectedSalaryMax);
            }
        }
        if (Availability) {
            if (Availability.toLowerCase() === 'immediate') {
              // Match immediate joiners (notice period 0)
              query['jobSeekerDetails.professionalDetails.noticePeriod'] = 0;
            } else {
              // Match candidates with notice period less than or equal to provided value
              query['jobSeekerDetails.professionalDetails.noticePeriod'] = {
                $lte: Number(Availability)
              };
            }
          }
          
        // 👥 Fetch matching candidates
        const candidates = await usersModel.find(query).lean();
    
        return candidates;
      },

      getTalentScoutJobs:async(userId: string)=>{
          // return await jobsModel.find({ 'createdBy.userId': userId });
          const jobs = await jobsModel.aggregate([
            {
              $match: {
                'createdBy.userId': new mongoose.Types.ObjectId(userId)
              }
            },
            {
              $lookup: {
                from: 'appliedcandidates',
                localField: '_id',
                foreignField: 'jobId',
                as: 'appliedCandidates'
              }
            },
            {
              $unwind: {
                path: '$appliedCandidates',
                preserveNullAndEmptyArrays: false
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'appliedCandidates.candidateId',
                foreignField: '_id',
                as: 'appliedCandidates.userDetails'
              }
            },
            {
              $unwind: {
                path: '$appliedCandidates.userDetails',
                preserveNullAndEmptyArrays: false
              }
            },
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $setIntersection: [
                          '$skills',
                          {
                            $ifNull: [
                              '$appliedCandidates.userDetails.jobSeekerDetails.professionalDetails.skills',
                              []
                            ]
                          }
                        ]
                      }
                    },
                    0
                  ]
                }
              }
            },
            {
              $group: {
                _id: '$_id',
                job: { $first: '$$ROOT' },
                appliedCandidates: { $push: '$appliedCandidates' }
              }
            },
            {
              $addFields: {
                'job.appliedCandidates': '$appliedCandidates',
                'job.filteredCandidatesCount': { $size: '$appliedCandidates' }
              }
            },
            {
              $replaceRoot: {
                newRoot: '$job'
              }
            }
            
          ]);
          

          return jobs
        },
};
