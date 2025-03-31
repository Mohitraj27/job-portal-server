import { responseMiddleware } from '@middlewares/responseMiddleware';
import { Router } from 'express';
import { appliedCandidatesController } from './applied-candidates.controller';
import { 
  validateCreateApplicationMiddleware,
  validateUpdateStatusMiddleware,
  validateShortlistCandidateMiddleware,
  validateAddNotesMiddleware,
  validateGetApplicationsQueryMiddleware
} from './applied-candidates.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';

const appliedCandidatesRouter = Router();
appliedCandidatesRouter.param('id', validateObjectId);
// appliedCandidatesRouter.param('jobId', validateObjectId);
// appliedCandidatesRouter.param('candidateId', validateObjectId);

appliedCandidatesRouter.use(responseMiddleware);

// Application submission endpoints
appliedCandidatesRouter
  .route('/apply')
  .post(validateCreateApplicationMiddleware, appliedCandidatesController.createApplication);

// Get applications by job ID
appliedCandidatesRouter
  .route('/job/:jobId')
  .get(validateGetApplicationsQueryMiddleware, appliedCandidatesController.getApplicationsByJobId);

// Get applications by candidate ID
appliedCandidatesRouter
  .route('/candidate/:candidateId')
  .get(validateGetApplicationsQueryMiddleware, appliedCandidatesController.getApplicationsByCandidate);

// Get single application
appliedCandidatesRouter
  .route('/:id')
  .get(appliedCandidatesController.getApplicationById)
  .delete(appliedCandidatesController.deleteApplication);

// Update application status
appliedCandidatesRouter
  .route('/:id/status')
  .patch(validateUpdateStatusMiddleware, appliedCandidatesController.updateApplicationStatus);

// Shortlist candidate
appliedCandidatesRouter
  .route('/shortlist/:id')
  .patch(validateShortlistCandidateMiddleware, appliedCandidatesController.shortlistCandidate);

// Add notes to application
appliedCandidatesRouter
  .route('/:id/notes')
  .patch(validateAddNotesMiddleware, appliedCandidatesController.addNotes);

// Get job application statistics
appliedCandidatesRouter
  .route('/stats/:jobId')
  .get(appliedCandidatesController.getApplicationStats);

// Get shortlisted count for a job
appliedCandidatesRouter
  .route('/shortlisted-count/:jobId')
  .get(appliedCandidatesController.getShortlistedCount);

export default appliedCandidatesRouter;