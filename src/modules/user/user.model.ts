import mongoose, { Schema } from 'mongoose';
import {
  AccountStatus,
  ApplicationStatus,
  EmploymentType,
  Gender,
  IUser,
  Provider,
  Role,
  WorkType,
} from './user.types';

const userSchema: Schema = new Schema({
  role: {
    type: String,
    enum: [Role.JOBSEEKER, Role.EMPLOYER],
    required: true,
  },
  personalDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: {
      countryCode: { type: String },
      number: { type: String },
    },
    password: { type: String },
    profilePicture: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: Object.values(Gender) },
  },
  socialLogins: [
    {
      provider: { type: String, enum: Object.values(Provider) },
      providerId: { type: String },
    },
  ],
  jobSeekerDetails: {
    education: [
      {
        qualification: { type: String },
        specialization: { type: String },
        institutionName: { type: String },
        yearOfGraduation: { type: Number },
        certifications: [
          {
            name: { type: String },
            date: { type: Date },
          },
        ],
      },
    ],
    professionalDetails: {
      currentJobTitle: { type: String },
      currentEmployer: { type: String },
      totalExperience: { type: Number },
      skills: [{ type: String }],
      resume: { type: String },
      keyAchievements: { type: String },
      noticePeriod: { type: String },
      currentCTC: { type: Number },
      expectedCTC: { type: Number },
      employmentType: {
        type: String,
        enum: [...Object.values(EmploymentType)],
      },
    },
    jobPreferences: {
      preferredJobTitles: [{ type: String }],
      preferredLocations: [{ type: String }],
      preferredIndustries: [{ type: String }],
      workType: { type: String, enum: [...Object.values(WorkType)] },
      expectedSalary: { type: Number },
      jobAlerts: { type: Boolean, default: true },
    },
    applicationsHistory: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
        status: {
          type: String,
          enum: [...Object.values(ApplicationStatus)],
          default: 'Applied',
        },
        appliedDate: { type: Date, default: Date.now },
      },
    ],
  },
  employerDetails: {
    companyName: { type: String },
    companyLogo: { type: String },
    companyWebsite: { type: String },
    companySize: { type: Number },
    companyIndustry: { type: String },
    companyDescription: { type: String },
    jobPostings: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
        postingDate: { type: Date, default: Date.now },
      },
    ],
  },
  activityDetails: {
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountStatus: {
      type: String,
      enum: [...Object.values(AccountStatus)],
      default: AccountStatus.ACTIVE,
    },
    lastLogin: { type: Date, default: Date.now },
    accountCreationDate: { type: Date, default: Date.now },
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
