
import { NextFunction, Request, Response } from 'express';
import { email_campaignService } from './email_campaign.service';
import httpStatus from '@utils/httpStatus';
import { EMAIL_CAMPAIGN_MESSAGES } from './email_campaign.enum';
import { throwError } from '@utils/throwError';

export const email_campaignController = {
  async createEmail_campaign(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await email_campaignService.createEmail_campaign(req.body);
      res.sendResponse(httpStatus.CREATED, data, EMAIL_CAMPAIGN_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllEmail_campaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await email_campaignService.getAllEmail_campaigns(req.query);
      res.sendResponse(httpStatus.OK, data, EMAIL_CAMPAIGN_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleEmail_campaign(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await email_campaignService.getSingleEmail_campaign(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMAIL_CAMPAIGN_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMAIL_CAMPAIGN_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateEmail_campaign(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await email_campaignService.updateEmail_campaign(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMAIL_CAMPAIGN_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMAIL_CAMPAIGN_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteEmail_campaign(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await email_campaignService.deleteEmail_campaign(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMAIL_CAMPAIGN_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMAIL_CAMPAIGN_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  