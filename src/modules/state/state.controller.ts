
import { NextFunction, Request, Response } from 'express';
import { stateService } from './state.service';
import httpStatus from '@utils/httpStatus';
import { STATE_MESSAGES } from './state.enum';
import { throwError } from '@utils/throwError';

export const stateController = {
  async createState(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await stateService.createState(req.body);
      res.sendResponse(httpStatus.CREATED, data, STATE_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllStates(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await stateService.getAllStates(req.query);
      res.sendResponse(httpStatus.OK, data, STATE_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleState(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await stateService.getSingleState(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, STATE_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, STATE_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateState(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await stateService.updateState(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, STATE_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, STATE_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteState(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await stateService.deleteState(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, STATE_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, STATE_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  