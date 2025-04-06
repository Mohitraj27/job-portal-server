import mongoose from "mongoose";
import TalentScout from "./talent-scout.model";
import jobsModel from "@modules/jobs/jobs.model";
import usersModel from "@modules/user/user.model";
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
    }
};
