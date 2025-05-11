
import { NextFunction, Request, Response } from 'express';
import { admin_dashboardService } from './admin_dashboard.service';
import httpStatus from '@utils/httpStatus';
import { ADMIN_DASHBOARD_MESSAGES } from './admin_dashboard.enum';
import { throwError } from '@utils/throwError';

export const admin_dashboardController = {
  async createAdmin_dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.createAdmin_dashboard(req.body);
      res.sendResponse(httpStatus.CREATED, data, ADMIN_DASHBOARD_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAllAdmin_dashboards(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.getAllAdmin_dashboards(req.query);
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingleAdmin_dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.getSingleAdmin_dashboard(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ADMIN_DASHBOARD_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async updateAdmin_dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.updateAdmin_dashboard(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ADMIN_DASHBOARD_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async deleteAdmin_dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.deleteAdmin_dashboard(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ADMIN_DASHBOARD_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  },
  async getAdmin_dashboardCardsCount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.getAdmin_dashboardCardsCount();
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getUserRegistrationTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.getUserRegistrationTrends();
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getJobsApplicationsTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const data =
        await admin_dashboardService.getMonthlyJobApplicationTrends();
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getJobSeekerDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin_dashboardService.getJobSeekerDemographics();
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getJobSeekerActivity(req: Request, res: Response, next: NextFunction) { 
    try {
      const data = await admin_dashboardService.getJobSeekerActivity();
      res.sendResponse(httpStatus.OK, data, ADMIN_DASHBOARD_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  }
};
  