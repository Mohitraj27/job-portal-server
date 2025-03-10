
import { NextFunction, Request, Response } from 'express';
import { automationsService } from './automations.service';
import httpStatus from '@utils/httpStatus';
import { AUTOMATIONS_MESSAGES } from './automations.enum';
import { throwError } from '@utils/throwError';

export const automationsController = {
  async createAutomations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await automationsService.createAutomations(req.body);
      res.sendResponse(httpStatus.CREATED, data, AUTOMATIONS_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllAutomationss(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await automationsService.getAllAutomationss(req.query);
      res.sendResponse(httpStatus.OK, data, AUTOMATIONS_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleAutomations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await automationsService.getSingleAutomations(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, AUTOMATIONS_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, AUTOMATIONS_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateAutomations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await automationsService.updateAutomations(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, AUTOMATIONS_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, AUTOMATIONS_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteAutomations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await automationsService.deleteAutomations(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, AUTOMATIONS_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, AUTOMATIONS_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  