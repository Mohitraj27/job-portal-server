import { NextFunction, Request, Response } from 'express';
import { locationService } from './location.service';
import httpStatus from '@utils/httpStatus';
import { LOCATION_MESSAGES } from './location.enum';
import { throwError } from '@utils/throwError';

export const locationController = {
  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await locationService.getCities(req.query);
      res.sendResponse(httpStatus.OK, data, LOCATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await locationService.getStates(req.query);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, LOCATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, LOCATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await locationService.getCountries();
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, LOCATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, LOCATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getAllLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await locationService.getAllLocations(req.query);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, LOCATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, LOCATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  }
};
