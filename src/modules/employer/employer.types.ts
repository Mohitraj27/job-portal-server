import { Document } from "mongoose";

export interface ICompany extends Document {
  logo?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  establishedDate?: Date;
  teamSize?: string;
  industry?: string;
  allowInSearch?: boolean;
  about?: string;
  benefits?: { title: string; description: string }[];
  customBenefits?: { title: string; description: string }[];
  country?: string;
  city?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
    instagram?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
