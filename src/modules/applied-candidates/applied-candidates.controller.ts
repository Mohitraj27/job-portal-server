import { NextFunction,  Request, Response } from 'express';
import { appliedCandidatesService } from './applied-candidates.service';
import httpStatus from '@utils/httpStatus';
import { APPLIED_CANDIDATES_MESSAGES } from './applied-candidates.enum';
import { throwError } from '@utils/throwError';
import { ApplicationStatus, AppliedCandidateQuery } from './applied-candidates.types';

export const appliedCandidatesController = {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.createApplication(req.body);
      res.sendResponse(httpStatus.CREATED, application, APPLIED_CANDIDATES_MESSAGES.APPLICATION_CREATED);
    } catch (error) {
      next(error);
    }
  },
  
  async getApplicationsByJobId(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await appliedCandidatesService.getApplicationsByJobId(req.params.jobId, req.query);
      res.sendResponse(httpStatus.OK, applications, APPLIED_CANDIDATES_MESSAGES.APPLICATIONS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  

  async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.getApplicationById(req.params.id);
      if (!application) {
        return throwError(httpStatus.NOT_FOUND, APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, application, APPLIED_CANDIDATES_MESSAGES.APPLICATION_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  
  async getApplicationsByCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as AppliedCandidateQuery;
      const applications = await appliedCandidatesService.getApplicationsByCandidate(
        req.params.candidateId, 
        query
      );
      res.sendResponse(httpStatus.OK, applications, APPLIED_CANDIDATES_MESSAGES.APPLICATIONS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  
  async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.updateApplicationStatus(
        req.params.id, 
        req.body.status as ApplicationStatus
      );
      res.sendResponse(httpStatus.OK, application, APPLIED_CANDIDATES_MESSAGES.STATUS_UPDATED);
    } catch (error) {
      next(error);
    }
  },
  
  async shortlistCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.shortlistCandidate(
        req.params.id, 
        req.body.isShortlisted
      );
      const message = req.body.isShortlisted ? 
        APPLIED_CANDIDATES_MESSAGES.CANDIDATE_SHORTLISTED : 
        APPLIED_CANDIDATES_MESSAGES.CANDIDATE_UNSHORTLISTED;
      
      res.sendResponse(httpStatus.OK, application, message);
    } catch (error) {
      next(error);
    }
  },
  
  async addNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.addNotes(
        req.params.id, 
        req.body.notes
      );
      res.sendResponse(httpStatus.OK, application, APPLIED_CANDIDATES_MESSAGES.APPLICATION_UPDATED);
    } catch (error) {
      next(error);
    }
  },
  
  async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await appliedCandidatesService.deleteApplication(req.params.id);
      if (!application) {
        return throwError(httpStatus.NOT_FOUND, APPLIED_CANDIDATES_MESSAGES.APPLICATION_NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, application, APPLIED_CANDIDATES_MESSAGES.APPLICATION_DELETED);
    } catch (error) {
      next(error);
    }
  },
  
  async getApplicationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await appliedCandidatesService.getApplicationStats(req.params.jobId);
      res.sendResponse(httpStatus.OK, stats, APPLIED_CANDIDATES_MESSAGES.APPLICATIONS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  
  async getShortlistedCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await appliedCandidatesService.getShortlistedCount(req.params.jobId);
      res.sendResponse(httpStatus.OK, { shortlistedCount: count }, APPLIED_CANDIDATES_MESSAGES.APPLICATIONS_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  
  async toggleBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, candidateId, isBookmarked } = req.body;
      
      const application = await appliedCandidatesService.toggleBookmark(jobId, candidateId, isBookmarked);
      
      const message = isBookmarked ?  APPLIED_CANDIDATES_MESSAGES.APPLICATION_BOOKMARKED : 
       APPLIED_CANDIDATES_MESSAGES.APPLICATION_UNBOOKMARKED;
      
      res.sendResponse(httpStatus.OK, application, message);
    } catch (error) {
      next(error);
    }
  }
};