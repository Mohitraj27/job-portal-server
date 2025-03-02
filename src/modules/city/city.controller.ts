
import { NextFunction, Request, Response } from 'express';
import { cityService } from './city.service';
import httpStatus from '@utils/httpStatus';
import { CITY_MESSAGES } from './city.enum';
import { throwError } from '@utils/throwError';

export const cityController = {
  async createCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.createCity(req.body);
      res.sendResponse(httpStatus.CREATED, data, CITY_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllCitys(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.getAllCitys(req.query);
      res.sendResponse(httpStatus.OK, data, CITY_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.getSingleCity(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CITY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CITY_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.updateCity(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CITY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CITY_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.deleteCity(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, CITY_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, CITY_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  