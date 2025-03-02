
import { NextFunction, Request, Response } from 'express';
import { countryService } from './country.service';
import httpStatus from '@utils/httpStatus';
import { COUNTRY_MESSAGES } from './country.enum';
import { throwError } from '@utils/throwError';

export const countryController = {
  async createCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await countryService.createCountry(req.body);
      res.sendResponse(httpStatus.CREATED, data, COUNTRY_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllCountrys(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await countryService.getAllCountrys(req.query);
      res.sendResponse(httpStatus.OK, data, COUNTRY_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await countryService.getSingleCountry(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, COUNTRY_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await countryService.updateCountry(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, COUNTRY_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await countryService.deleteCountry(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, COUNTRY_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  