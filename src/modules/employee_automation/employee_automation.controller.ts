
import { NextFunction, Request, Response } from 'express';
import { employee_automationService } from './employee_automation.service';
import httpStatus from '@utils/httpStatus';
import { EMPLOYEE_AUTOMATION_MESSAGES } from './employee_automation.enum';
import { throwError } from '@utils/throwError';

export const employee_automationController = {
  async createEmployee_automation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employee_automationService.createEmployee_automation(req.body);
      res.sendResponse(httpStatus.CREATED, data, EMPLOYEE_AUTOMATION_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllEmployee_automations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employee_automationService.getAllEmployee_automations(req.query);
      res.sendResponse(httpStatus.OK, data, EMPLOYEE_AUTOMATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleEmployee_automation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employee_automationService.getSingleEmployee_automation(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYEE_AUTOMATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYEE_AUTOMATION_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateEmployee_automation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employee_automationService.updateEmployee_automation(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYEE_AUTOMATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYEE_AUTOMATION_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployee_automation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await employee_automationService.deleteEmployee_automation(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, EMPLOYEE_AUTOMATION_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, EMPLOYEE_AUTOMATION_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  