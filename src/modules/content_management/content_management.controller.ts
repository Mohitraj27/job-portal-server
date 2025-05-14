
import { NextFunction, Request, Response } from 'express';
import { content_managementService } from './content_management.service';
import httpStatus from '@utils/httpStatus';
import { CONTENT_MANAGEMENT_MESSAGES } from './content_management.enum';
import { throwError } from '@utils/throwError';

export const content_managementController = {
  async createContent_management(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.createContent_management(req.body);
      res.sendResponse(httpStatus.CREATED, data, CONTENT_MANAGEMENT_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllContent_managements(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.getAllContent_managements(req.query);
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleContent_management(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.getSingleContent_management(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CONTENT_MANAGEMENT_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateContent_management(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.updateContent_management(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CONTENT_MANAGEMENT_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteContent_management(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.deleteContent_management(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CONTENT_MANAGEMENT_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  },
  async getContent_managementByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.getContent_managementByStatus();
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CONTENT_MANAGEMENT_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
 async getTopFiveContents(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await content_managementService.getTopFiveContents();
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CONTENT_MANAGEMENT_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CONTENT_MANAGEMENT_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  }
};
  