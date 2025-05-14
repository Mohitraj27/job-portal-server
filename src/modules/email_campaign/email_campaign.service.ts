
import email_campaignModel from './email_campaign.model';
import { IEmail_campaign } from './email_campaign.types';

export const email_campaignService = {
  async createEmail_campaign(data: IEmail_campaign) {
    return await email_campaignModel.create(data);
  },

  async getAllEmail_campaigns(query: any) {
    return await email_campaignModel.find(query);
  },

  async getSingleEmail_campaign(id: string) {
    return await email_campaignModel.findById(id);
  },

  async updateEmail_campaign(id: string, data: Partial<IEmail_campaign>) {
    return await email_campaignModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteEmail_campaign(id: string) {
    return await email_campaignModel.findByIdAndDelete(id);
  }
};
  