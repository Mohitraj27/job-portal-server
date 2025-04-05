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
    firstName: { type: String,  },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: {
      countryCode: { type: String },
      number: { type: String },
    },
    password: { type: String },
    profilePicture: { type: String },
    age: { type: String },
    gender: { type: String, enum: Object.values(Gender) },
    bio: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    languages: [{ type: String }],
    dateOfBirth: { type: Date },
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
        institution: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
        grade: { type: String },
      },
    ],
    achivements: [
      {
        title: { type: String },
        organization: { type: String },
        issuedDate: { type: Date },
        description: { type: String },
      },
    ],
    professionalExperience: [
      {
        companyName: { type: String },
        jobTitle: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        keyAchievements: { type: String },
      },
    ],
    professionalDetails: {
      website: { type: String },
      linkedIn: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      portfolio: { type: String },
      currentJobTitle: { type: String },
      currentEmployer: { type: String },
      totalExperience: { type: Number },
      skills: [{ type: String }],
      resume: {
        type: {
          url: { type: String },
          isVerified: { type: Boolean, default: false },
          isPublic: { type: Boolean, default: false },
        },
      },
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
    email: { type: String },
    phoneNumber: {
      countryCode: { type: String },
      number: { type: String },
    },
    website: { type: String },
    logoUrl: { type: String },
    establishedYear: { type: Date },
    companySize: { type: String },
    industry: { type: String },
    allowInSearch: { type: Boolean, default: true },
    companyDescription: { type: String },
    benefitsAndPerks: [
      { title: { type: String }, description: { type: String } },
    ],
    socialLinks: {
      linkedIn: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    contactInfo: {
      country: { type: String },
      state: { type: String },
      city: { type: String },
      completeAddress: { type: String },
    }

    // jobPostings: [

    //   {
    //     jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    //     postingDate: { type: Date, default: Date.now },
    //   },
    // ],
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
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
