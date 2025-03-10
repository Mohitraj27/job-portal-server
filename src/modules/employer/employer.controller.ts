
import { NextFunction, Request, Response } from 'express';
import { employerService } from './employer.service';
import httpStatus from '@utils/httpStatus';
import { EMPLOYER_MESSAGES } from './employer.enum';
import { throwError } from '@utils/throwError';

export const employerController = {
  async createEmployer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employerService.createEmployer(req.body);
      res.sendResponse(httpStatus.CREATED, data, EMPLOYER_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllEmployers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employerService.getAllEmployers(req.query);
      res.sendResponse(httpStatus.OK, data, EMPLOYER_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleEmployer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employerService.getSingleEmployer(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYER_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYER_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateEmployer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employerService.updateEmployer(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYER_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYER_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employerService.deleteEmployer(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYER_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYER_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  